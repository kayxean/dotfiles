---
name: custom-tool
description: >
  Master routing guide for all custom CLI tools. Consult this first to
  decide which tool to use for any filesystem, search, inspection,
  replacement, or project task. Prevents falling back to standard shell
  commands like find, grep, cat, sed, ls, npm, npx, or bun.
---

## What I do

I am the single source of truth for tool selection. Every task maps to exactly one primary tool. When in doubt, consult this skill before acting.

## Mandatory Replacement Table

These standard commands are **banned**. Always use the mapped alternative.

| Banned Command               | Use Instead | Notes                                                    |
| :--------------------------- | :---------- | :------------------------------------------------------- |
| `npm`, `yarn`, `pnpm`, `bun` | `vp`        | vp auto-detects the right package manager from lockfiles |
| `npx`                        | `vp dlx`    | e.g. `vp dlx create-next-app`                            |
| `find`                       | `fd`        | `hidden: true`, `fileType`, `extension`                  |
| `grep`                       | `rg`        | `fixedStrings: true`, `context`                          |
| `cat`                        | `bat`       | defaults: line numbers, no pager, no color               |
| `ls` / `tree`                | `eza`       | `tree: true`, `git: true`, `level`                       |
| `sed`                        | `sd`        | `fixedStrings: true`, always `preview: true` first       |

---

## Decision Tree

```
What do I need to do?
│
├── Any project task — run, build, test, lint, format, manage deps?
│   └── vp  (always — it auto-detects pnpm / bun / npm / yarn from lockfiles)
│       Never invoke npm, yarn, pnpm, bun, or npx directly.
│
├── Find files or directories?
│   └── fd  (always set hidden: true)
│
├── Read / inspect file contents?
│   └── bat  (use plain: true only when piping output elsewhere)
│
├── Search for a pattern across files?
│   └── rg  (prefer fixedStrings: true for source code literals)
│
├── Replace text in files?
│   └── sd  (mandatory: preview: true → verify → apply)
│
├── Understand directory structure or Git status?
│   └── eza  (tree: true + git: true for most reviews)
│
└── Work with a JSON file?
    ├── Read / extract data → jq  (read-only; rawOutput: true for plain strings)
    ├── Change a scalar value → sd  (fixedStrings: true, preview first, only if pattern is unique)
    └── Restructure / reorder keys → not possible; use jq to show correct output, ask user to apply
```

---

## Critical Behavioural Rules

### 1. `vp` — always the entry point, regardless of package manager

`vp` reads the project's lockfile and delegates to the correct package manager automatically:

- `bun.lockb` → uses bun
- `pnpm-lock.yaml` → uses pnpm (default fallback)
- `package-lock.json` → uses npm
- `yarn.lock` → uses yarn

Never check which package manager the project uses and then invoke it directly. Just run `vp`. This is true even when you can see a `bun.lockb` — still use `vp`, not `bun`.

### 2. `bat` — defaults are already correct

The tool always runs with `--style=numbers --color=never --paging=never`.

- **Do not** pass `-pp` — it is not a valid tool argument.
- Use `plain: true` only when the output will be piped to another step (it removes line numbers and decorations entirely).
- Use `diff: true` to show only Git-modified lines — ideal for targeted code review.

### 3. `fd` — no `-x` / exec chaining inside the tool

`fd` returns a list of paths. It does **not** support `-x` execution chaining within the tool call.
Correct pattern:

```
Step 1 → fd   (collect matching paths)
Step 2 → bat  (read each path)  OR  sd  (replace across them)
```

Never write `fd ... -x bat` — that shell syntax doesn't exist in the tool API.

### 4. `sd` — preview is mandatory, not optional

`sd` modifies files **in-place with no undo**. The workflow is always two steps:

```
Step 1 → sd  preview: true   ← inspect the diff
Step 2 → sd  preview: false  ← apply only after confirming
```

Always set `fixedStrings: true` unless capture groups are strictly required.

### 5. `jq` — read-only; cannot write back to files

`jq` defaults to `--monochrome-output`. Never set `colorOutput: true` during agent runs.
Use `rawOutput: true` whenever you need a plain string value rather than a JSON-quoted one.

**`jq` is read-only in this toolset.** The tool returns stdout only — there is no in-place flag, no redirection, no temp file handling. For JSON mutations, choose based on scope:

| What needs to change                        | Approach                                                                                     |
| :------------------------------------------ | :------------------------------------------------------------------------------------------- |
| A scalar value (string, number, bool)       | `sd` with `fixedStrings: true` — only if the pattern is unique in the file                   |
| A key name                                  | `sd` — only if the key appears once and has a single-line value                              |
| A multi-line value, nested object, or array | Not safe with `sd`; do not attempt                                                           |
| Key reordering or structural transformation | Not possible; use `jq` to compute and show the correct output, then ask the user to apply it |

Never use `sd` regex patterns against JSON structure. Whitespace variations and multi-line values will cause silent corruption.

### 6. `rg` — know your default output format

Every `rg` result is formatted as `filename:line:column:content`.
When you only need filenames, use `filesWithMatches: true` to suppress content noise.
Always prefer `fixedStrings: true` for source-code patterns — dots, brackets, and parentheses are regex metacharacters.

---

## Canonical Workflows

### Explore a project from scratch

```
1. eza  tree: true, git: true, level: 3, ignoreGlob: ["node_modules", ".git", "dist"]
2. bat  filepath: "package.json"               ← understand the project shape
3. jq   filter: ".scripts"  filepath: "package.json"   ← see available commands
4. vp   outdated                               ← check dependency health
```

### Find and inspect an implementation

```
1. fd   pattern: "auth-provider"  hidden: true  fileType: "f"
2. bat  filepath: <result>  lineRange: "1:60"  ← read the relevant section
```

### Safe global refactor

```
1. rg   pattern: "OldName"  fixedStrings: true  filesWithMatches: true
        ← confirm scope before touching anything
2. sd   find: "OldName"  replace: "NewName"  files: [<rg results>]
        fixedStrings: true  preview: true
        ← read the diff carefully
3. sd   find: "OldName"  replace: "NewName"  files: [<same list>]
        fixedStrings: true
        ← apply
```

### Pre-commit quality check

```
1. fd   fileType: "f"  changedWithin: "4h"  hidden: true  ← scope the review
2. bat  diff: true  filepath: <each changed file>          ← read only what changed
3. rg   pattern: "console.log"  fixedStrings: true         ← no debug logs
4. rg   pattern: "TODO|FIXME"   fixedStrings: true         ← no stale work items
5. vp   check                                              ← fmt + lint + type-check
```

### Add a dependency (any project type)

```
vp add zod          ← vp detects bun/pnpm/npm/yarn and delegates correctly
vp add -D vitest    ← same for dev deps
```
