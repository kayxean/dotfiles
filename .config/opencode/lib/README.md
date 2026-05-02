# OpenCode Custom Tools — Architecture & Improvement Plan

This directory contains shared utilities for the 12 custom tools in `../tools/`. This document outlines current vulnerabilities, performance bottlenecks, and a roadmap for improvements without breaking existing tool implementations.

## Overview

The 12 tools are:

1. `view.ts` — Read files with syntax highlighting (bat)
2. `deps.ts` — Package manager orchestration (vp/bun)
3. `text.ts` — Text/regex search (ripgrep)
4. `find.ts` — File discovery (fd)
5. `list.ts` — Directory listing (eza)
6. `trace.ts` — AST search & rewrite (ast-grep)
7. `ref.ts` — Text pattern replacement (srgn)
8. `pick.ts` — Structured data extraction (jg)
9. `diff.ts` — Syntax-aware diffing (difft)
10. `stats.ts` — Code statistics (tokei)
11. `regex.ts` — Pattern generation (grex)
12. `fetch.ts` — URL content retrieval (fetchkit)

All tools follow a **consistent pattern**:

- Import `CommandResult` type and `execAsync()`/`shellEscape()` from `../lib/`
- Build a CLI command string using `shellEscape()` for arguments
- Execute via `execAsync()` with fixed 30-second timeout and 10 MB buffer
- Return structured output with metadata

---

## Current Architecture

### `shell.ts`

Exports two key functions:

```typescript
export const execAsync(command, options) => PromiseWithChild
export function shellEscape(arg: string): string
```

**Issues & Vulnerabilities:**

#### 1. **Insufficient Shell Escaping** ⚠️ CRITICAL

Current implementation:

```typescript
export function shellEscape(arg: string): string {
  if (/^[a-zA-Z0-9_\-./:@]+$/.test(arg)) {
    return arg;
  }
  return `'${arg.replaceAll("'", "'\\''")}'`;
}
```

**Vulnerabilities:**

- **Unicode handling**: Paths with non-ASCII characters (e.g., `café/file.txt`) are escaped but may cause issues on certain shells or terminal encodings.
- **Control characters**: NUL bytes (`\0`), newlines, and other control chars in filenames will break the shell string, causing command injection or silent failures.
- **Shell metacharacters in fast path**: Whitespace like `\t`, `\n`, and other POSIX special chars (`` ` ``, `$`, `\`, `"`) are not caught by the regex and pass through unescaped.
- **Assumption about shell**: The code assumes POSIX shell quoting; may fail in non-POSIX shells or on Windows with Git Bash.

**Attack Scenario:**

```bash
# Filename: hello'; rm -rf /; echo '.txt
# After current shellEscape:
# 'hello'\''; rm -rf /; echo '.txt'
# This breaks out of the quote and executes rm -rf /
```

**Improvements Needed:**

- Add explicit check for control characters (0x00–0x1F, 0x7F) and reject or escape them properly.
- Extend the fast-path regex to include all safe ASCII (currently misses `?`, `*`, spaces, tabs).
- Consider using a dedicated library (e.g., `escape-string-regexp` or Node's `child_process` array-based API).
- Document shell context assumptions.

---

#### 2. **No Timeout Control in Tool Schemas** ⚠️ MEDIUM

Current pattern:

```typescript
// In every tool:
timeout: 30000,  // hardcoded
maxBuffer: 10 * 1024 * 1024,  // hardcoded
```

**Issues:**

- No way for tools to override timeout per-call (e.g., `trace.ts` scanning a large codebase may legitimately need 60s).
- No way for users to request a longer timeout for slow operations.
- Silent truncation if output exceeds buffer; no warning.

**Improvements Needed:**

- Add optional `timeout` and `maxBuffer` parameters to `execAsync()` options.
- Emit a warning if buffer is exceeded.
- Document which tools might need custom timeouts (e.g., `trace.ts`, `stats.ts` on large projects).

---

#### 3. **Command Building via String Concatenation** ⚠️ MEDIUM

Pattern in every tool:

```typescript
const cmd = [
  'rg',
  '--color=never',
  '--no-heading',
  ...conditionalFlags,
  shellEscape(pattern),
  ...targetPaths,
].join(' ');
```

**Issues:**

- **Double-escaping risk**: If `conditionalFlags` already includes pre-escaped values, joining with spaces can cause issues.
- **Fragility**: Space handling is implicit; a flag with embedded spaces (rare but possible) could break.
- **Readability**: Hard to audit which flags are being set; easy to introduce off-by-one errors.
- **Lack of validation**: No check that the final command is well-formed before execution.

**Improvements Needed:**

- Create a helper: `buildCommand(bin: string, args: string[]): string` that:
  - Validates no argument is already escaped (or escapes all).
  - Returns a properly joined command string.
  - Logs the command for debugging (already done in metadata, but centralize it).
- Alternatively, refactor `execAsync()` to accept an array of arguments and call child_process with `{ shell: true, ... }` (safer API, avoids shell parsing).

---

#### 4. **Inconsistent Exit Code Handling** ⚠️ MEDIUM

Current patterns:

**`text.ts` and `find.ts`:**

```typescript
if (err.code === 1 || err.code === '1') {
  return { output: '', metadata: { info: 'No matches found.' } };
}
```

**`trace.ts`:**

```typescript
if ((err.code === 1 || err.code === '1') && (!err.stdout || err.stdout.trim().length === 0)) {
  return { ... note: 'No matches found' };
}
```

**Other tools (e.g., `pick.ts`, `fetch.ts`):**

```typescript
// No special handling; treat exit 1 as error
return { output: `Error executing ...` };
```

**Issues:**

- Tools are inconsistent: some treat exit code 1 as "no results", others as "error".
- Exit code 1 can mean different things in different CLIs:
  - `rg` / `fd`: "no matches" (success, zero results)
  - `jg`: "error in query"
  - `srgn`: "error"
- Silent success for "no matches" hides potential bugs (e.g., user typo in pattern returns empty, but agent doesn't know why).

**Improvements Needed:**

- Create a **uniform exit code interpretation layer** in `shell.ts`:

  ```typescript
  export type ExitCodeIntent = 'success' | 'no-results' | 'error';

  export function interpretExitCode(bin: string, code: number, stdout: string): ExitCodeIntent {
    // Map (binary, code, output context) → intent
    // e.g., ('rg', 1, '') → 'no-results'
    // e.g., ('jg', 1, err) → 'error'
  }
  ```

- Each tool calls this helper instead of duplicating logic.
- Return metadata that clearly states: "no results found" vs. "command failed".

---

#### 5. **No Distinction Between Empty Output & Truncation** ⚠️ MEDIUM

Current error handling:

```typescript
const result: CommandResult = await execAsync(cmd, {
  ...,
  maxBuffer: 10 * 1024 * 1024,
})
  .catch((err) => ({ success: false, error: err }));
```

**Issues:**

- If output exceeds 10 MB, Node.js emits `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` but it's indistinguishable from other errors.
- No indication to the agent that the result is incomplete.
- Tools like `stats.ts` on a huge codebase might silently truncate statistics.

**Improvements Needed:**

- Catch the specific error code and emit a clear warning.
- Consider allowing per-tool buffer sizes (e.g., `trace.ts` needs more).
- Document which operations might produce large output.

---

### `types.ts`

Current definition:

```typescript
export type CommandResult =
  | { readonly success: true; readonly stdout: string; readonly stderr: string }
  | {
      readonly success: false;
      readonly error: Error & { code?: number | string; stderr?: string };
    };
```

**Issues:**

- Too generic; `success: false` doesn't distinguish "no results" from "crash".
- `stderr` is optional but often critical; should always be captured.
- No metadata (e.g., which exit code caused the failure).

**Improvements Needed:**

- Extend the type to include more context:
  ```typescript
  export type CommandResult =
    | {
        readonly success: true;
        readonly stdout: string;
        readonly stderr: string;
        readonly exitCode: number;
      }
    | {
        readonly success: false;
        readonly error: Error & { code?: number | string; stderr?: string };
        readonly exitCode: number;
        readonly isTimeout?: boolean;
        readonly isBufferOverflow?: boolean;
      };
  ```

---

## Tool-Specific Issues

### High-Priority Issues

#### `trace.ts` — AST-Grep Large Codebase Handling

**Current state:**

- 30-second timeout, 10 MB buffer
- Used for code refactoring; often scans entire projects

**Issues:**

- A large codebase (>100K LOC) may hit 30-second timeout before scanning completes.
- AST-Grep output can be large (one match per line with context).

**Recommended Fix:**

- Add optional `timeout` parameter to tool schema.
- Increase default maxBuffer to 50 MB for this tool specifically.
- Document that deep AST searches over large codebases may require explicit timeout override.

---

#### `ref.ts` — Shell Redirection Fragility

**Current state:**

```typescript
const cmd = [..., shellEscape(args.scope), ...].join(' ') + ' < /dev/null';
```

**Issues:**

- Manual shell redirection (`< /dev/null`) is appended as a string; if `args.scope` contains the string `< /dev/null`, it breaks.
- Should be handled by the CLI, not the tool wrapper.

**Recommended Fix:**

- Pass `< /dev/null` as an environment variable or file descriptor option, not string concatenation.
- Or, validate that `args.scope` doesn't contain shell metacharacters that would interfere.

---

#### `fetch.ts` — Unvalidated URL & File Redirection

**Current state:**

```typescript
const cmd = args.saveToFile
  ? [...cmdParts, '>', shellEscape(args.saveToFile)].join(' ')
  : cmdParts.join(' ');
```

**Issues:**

- URL is not validated; malformed URLs (e.g., containing shell metacharacters) may cause issues.
- File path redirection (`>`) is handled by string concatenation; vulnerable to path injection.
- No check that `saveToFile` directory exists.

**Recommended Fix:**

- Validate URL format before escaping.
- Use a `--output` flag instead of shell redirection if `fetchkit` supports it.
- Check that parent directory of `saveToFile` is writable.

---

#### `pick.ts` — No Format Validation

**Current state:**

```typescript
format: tool.schema.enum(['auto', 'json', 'jsonl', 'yaml', 'toml', 'cbor', 'msgpack']);
```

**Issues:**

- No validation that the file actually matches the claimed format.
- If a `.yaml` file is actually invalid YAML, `jg` fails but no guidance on how to fix it.

**Recommended Fix:**

- Add optional validation in a helper: `validateFormatMatch(filepath, format): boolean`.
- Return a hint in metadata if format doesn't match.

---

### Performance Bottlenecks

#### 1. **String-Based Command Building is CPU-Inefficient** ⚠️ LOW

**Current pattern:**

```typescript
const cmd = [... many conditions ...].join(' ');
```

**Impact:** Negligible for typical usage (microseconds), but with 12 tools × multiple calls per session, it adds up.

**Fix:**

- Extract command building to a reusable function in `shell.ts`.
- Benchmark before and after; likely <1% overall impact.

---

#### 2. **No Early Exit for Pathological Inputs** ⚠️ MEDIUM

Example: `text.ts` with a pattern that matches millions of lines.

**Current behavior:**

- `ripgrep` streams matches for 30 seconds, then times out.
- Agent doesn't know about the timeout until the error.

**Fix:**

- Add `maxMatches` or `maxOutputSize` parameters to tools that search.
- Stop early and emit a warning if output looks pathological.
- Document for agents that they should use `maxResults` / `maxCount` to cap output.

---

#### 3. **Redundant Error Wrapping** ⚠️ LOW

**Current pattern in every tool:**

```typescript
.catch((err) => ({
  success: false,
  error: err instanceof Error ? err : new Error(String(err)),
}))
```

**Impact:** Minimal, but each tool duplicates error handling logic.

**Fix:**

- Extract to `shell.ts`:
  ```typescript
  export function normalizeError(err: unknown): Error & { ... } {
    return err instanceof Error ? err : new Error(String(err));
  }
  ```

---

## Testing Strategy

All 12 tools share the same execution pipeline: `shellEscape()` → command building → `execAsync()` → exit code handling.

### Unit Tests (Recommended)

Create `lib/__tests__/shell.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { shellEscape } from '../shell';

describe('shellEscape', () => {
  it('passes safe ASCII unchanged', () => {
    expect(shellEscape('file.ts')).toBe('file.ts');
    expect(shellEscape('/path/to/file')).toBe('/path/to/file');
    expect(shellEscape('hello_world-123')).toBe('hello_world-123');
  });

  it('escapes paths with spaces', () => {
    expect(shellEscape('hello world.ts')).toBe("'hello world.ts'");
  });

  it('escapes single quotes correctly', () => {
    expect(shellEscape("it's")).toBe("'it'\\''s'");
  });

  it('rejects or escapes control characters', () => {
    // Test: newline in filename
    expect(() => shellEscape('file\n.txt')).toThrow();
    // or, if we escape: check output is safe
  });

  it('rejects paths with NUL bytes', () => {
    expect(() => shellEscape('file\0.txt')).toThrow();
  });

  it('handles Unicode safely', () => {
    // Should not throw; should produce valid shell-escaped string
    expect(shellEscape('café/file.txt')).toMatch(/café/);
  });
});

describe('execAsync', () => {
  it('respects timeout option', async () => {
    const start = Date.now();
    try {
      await execAsync('sleep 5', { timeout: 500 });
    } catch (err) {
      expect(Date.now() - start).toBeLessThan(1500); // ~500 + margin
      expect((err as any).message).toMatch(/timeout|SIGTERM/i);
    }
  });

  it('captures stdout and stderr separately', async () => {
    const result = await execAsync('echo hello; echo world >&2', {});
    expect(result.stdout).toBe('hello');
    expect(result.stderr).toBe('world');
  });

  it('reports exit code in error', async () => {
    try {
      await execAsync('false', {});
    } catch (err) {
      expect((err as any).code).toBe(1);
    }
  });
});
```

### Integration Tests (Recommended)

Create `lib/__tests__/tools.integration.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { execAsync, shellEscape } from '../shell';

describe('tool patterns', () => {
  it('exits with code 1 and no stdout → no results', async () => {
    // Simulate: rg --fixed-strings 'pattern_that_does_not_exist' file.txt
    try {
      await execAsync('rg --fixed-strings "xyzabc123notfound" Cargo.lock', {});
    } catch (err) {
      expect((err as any).code).toBe(1);
      expect((err as any).stdout).toBe('');
    }
  });

  it('command building handles many flags', () => {
    const cmd = [
      'rg',
      '--color=never',
      '--no-heading',
      '--fixed-strings',
      '--max-count',
      '5',
      shellEscape('pattern'),
      '.',
    ].join(' ');

    expect(cmd).toMatch(/rg.*--color=never.*--no-heading.*--fixed-strings.*--max-count.*5/);
  });

  it('shellEscape in array context does not double-escape', () => {
    const paths = ['file 1.ts', 'file 2.ts'].map(shellEscape);
    const cmd = ['fd', ...paths].join(' ');
    // Should produce: fd 'file 1.ts' 'file 2.ts'
    // Not: fd \'file 1.ts\' \'file 2.ts\'
    expect(cmd).not.toMatch(/\\\'/);
  });
});
```

### Smoke Tests (For Each Tool)

Add simple CLI verification in a GitHub Actions workflow or pre-commit hook:

```bash
# Smoke test for view.ts
npx opencode view lib/shell.ts | grep -q "execAsync"

# Smoke test for find.ts
npx opencode find --pattern "*.ts" --maxResults 1 | grep -q "\.ts"

# Smoke test for text.ts
npx opencode text --pattern "export" --include "*.ts" | grep -q "export"
```

---

## Recommended Improvements (Prioritized)

### Phase 1: Security & Stability (Now)

1. **Upgrade `shellEscape()`**
   - Add control character validation.
   - Extend safe-character regex.
   - Add unit tests.
   - **Impact:** Prevents command injection vulnerabilities.

2. **Unify Exit Code Interpretation**
   - Create `interpretExitCode(bin, code, stdout)` helper in `shell.ts`.
   - Update all 12 tools to use it.
   - **Impact:** Consistent, predictable error reporting.

3. **Extend `CommandResult` Type**
   - Add `exitCode`, `isTimeout`, `isBufferOverflow` fields.
   - Update `execAsync()` to populate these.
   - **Impact:** Better diagnostics for agents.

### Phase 2: Robustness (Next Sprint)

4. **Tool-Specific Tuning**
   - `trace.ts`: Increase buffer to 50 MB, add optional timeout parameter.
   - `fetch.ts`: Validate URLs, check `saveToFile` directory.
   - `ref.ts`: Replace shell redirection with proper API calls.
   - **Impact:** Fewer timeouts and silent failures on edge cases.

5. **Command Building Helper**
   - Extract common pattern to `buildCommand()` utility.
   - Add validation and logging.
   - **Impact:** Easier to audit, less copy-paste errors.

6. **Add Tests**
   - Unit tests for `shell.ts`.
   - Integration tests for exit code handling.
   - Smoke tests for each tool.
   - **Impact:** Catch regressions early.

### Phase 3: Performance & UX (Later)

7. **Early Exit for Pathological Outputs**
   - Add `maxOutputSize` parameter.
   - Warn if output is truncated.
   - **Impact:** Agents get clear feedback if a search explodes.

8. **Streaming Output (Optional)**
   - For large operations, yield results incrementally.
   - Requires plugin API support.
   - **Impact:** Better UX for long-running searches.

---

## Code Examples

### Example 1: Improved `shellEscape()`

**Current (Vulnerable):**

```typescript
export function shellEscape(arg: string): string {
  if (/^[a-zA-Z0-9_\-./:@]+$/.test(arg)) {
    return arg;
  }
  return `'${arg.replaceAll("'", "'\\''")}'`;
}
```

**Improved (Type-Safe):**

```typescript
const SAFE_CHARS = /^[a-zA-Z0-9_\-./:@]+$/;
const CONTROL_CHARS = /[\x00-\x1f\x7f]/; // NUL, newline, etc.

export function shellEscape(arg: string): string {
  if (CONTROL_CHARS.test(arg)) {
    throw new Error(
      `shellEscape: argument contains control characters (NUL/newline/etc): ${JSON.stringify(arg)}`,
    );
  }

  if (SAFE_CHARS.test(arg)) {
    return arg;
  }

  // Properly escape for POSIX shell
  return `'${arg.replaceAll("'", "'\\''")}'`;
}
```

**Test:**

```typescript
expect(() => shellEscape('file\0.txt')).toThrow();
expect(() => shellEscape('file\n.txt')).toThrow();
expect(shellEscape('café/file.txt')).toBe("'café/file.txt'");
```

---

### Example 2: Unified Exit Code Handling

**New utility in `shell.ts`:**

```typescript
export type ExitCodeIntent = 'success' | 'no-results' | 'error';

const EXIT_CODE_MAP: Record<string, Record<number, ExitCodeIntent>> = {
  rg: { 0: 'success', 1: 'no-results', 2: 'error' },
  fd: { 0: 'success', 1: 'no-results', 2: 'error' },
  jg: { 0: 'success', 1: 'error', 2: 'error' },
  eza: { 0: 'success', 1: 'error', 2: 'error' },
  // ... etc for all binaries
};

export function interpretExitCode(binary: string, code: number, stdout: string): ExitCodeIntent {
  return EXIT_CODE_MAP[binary]?.[code] ?? 'error';
}
```

**Usage in tool (e.g., `text.ts`):**

```typescript
if (!result.success) {
  const intent = interpretExitCode('rg', result.error.code ?? -1, result.error.stdout ?? '');

  if (intent === 'no-results') {
    return { output: '', metadata: { info: 'No matches found.', exitCode: result.error.code } };
  }

  return { output: `Error executing rg: ${result.error.message}`, ... };
}
```

---

### Example 3: Improved `types.ts`

**Current:**

```typescript
export type CommandResult =
  | { readonly success: true; readonly stdout: string; readonly stderr: string }
  | { readonly success: false; readonly error: Error & { ... } };
```

**Improved:**

```typescript
export type CommandSuccess = {
  readonly success: true;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: 0;
};

export type CommandFailure = {
  readonly success: false;
  readonly error: Error & { code?: number | string; stderr?: string };
  readonly exitCode: number;
  readonly isTimeout?: boolean;
  readonly isBufferOverflow?: boolean;
};

export type CommandResult = CommandSuccess | CommandFailure;
```

---

## Deployment Notes

When implementing these improvements:

1. **Backward Compatibility**: All changes should be additive (new fields in `CommandResult`, new helpers in `shell.ts`). Existing tool code should continue to work.

2. **Rollout**: Update `shell.ts` first, then gradually migrate each tool to use new helpers.

3. **Validation**: Run the smoke tests after each tool update to confirm no regressions.

4. **Documentation**: Update tool descriptions to mention new timeout/buffer options (if added to schemas).

---

## Summary

| Issue                                  | Severity | Category        | Phase |
| -------------------------------------- | -------- | --------------- | ----- |
| `shellEscape()` control char injection | Critical | Security        | 1     |
| Inconsistent exit code handling        | Medium   | Reliability     | 1     |
| Command building fragility             | Medium   | Maintainability | 2     |
| No timeout/buffer control              | Medium   | Robustness      | 2     |
| `trace.ts` timeout on large codebases  | Medium   | Performance     | 2     |
| No distinction b/w empty & truncated   | Medium   | Debugging       | 2     |
| Fetch.ts shell redirection             | Medium   | Security        | 2     |
| No tests for shared utilities          | Medium   | Quality         | 2     |
| Redundant error handling               | Low      | Maintainability | 3     |
| Early exit for pathological output     | Low      | UX              | 3     |

---

## References

- Node.js `child_process` docs: https://nodejs.org/api/child_process.html
- OWASP Shell Injection: https://owasp.org/www-community/attacks/Command_Injection
- Ripgrep exit codes: https://github.com/BurntSushi/ripgrep#exit-status
- ast-grep docs: https://ast-grep.github.io/
