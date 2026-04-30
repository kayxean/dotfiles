---
name: search-edit
description: >
  Find files with fd, read them with bat, search patterns with rg,
  extract JSON with jq, and apply safe in-place edits with sd.
  Use for any codebase navigation, inspection, or refactoring task.
---

## What I do

I provide a safe, high-performance workflow for navigating, reading, and modifying codebases. Every operation has a purpose-built tool; never fall back to `find`, `cat`, `grep`, or `sed`.

## Tool Quick Reference

| Task                  | Tool  | Key flags                                 |
| :-------------------- | :---- | :---------------------------------------- |
| Find files / dirs     | `fd`  | `hidden:true`, `fileType`, `extension`    |
| Read file contents    | `bat` | `lineRange`, `plain:true` when piping     |
| Search text patterns  | `rg`  | `fixedStrings:true`, `context`, `globs`   |
| Replace text in files | `sd`  | `preview:true` first, `fixedStrings:true` |
| Extract from JSON     | `jq`  | `rawOutput:true` for plain strings        |

---

## fd — File Discovery

```
# Find all TypeScript files including hidden config files
fd --hidden --fileType f --extension ts

# Find files by name fragment, including dotfiles
fd --pattern auth --hidden --fileType f

# Find and pipe to bat for immediate inspection
fd --pattern "use-auth" --extension ts --hidden
# then: bat <result path>

# Scoped search within a directory
fd --path src/ --fileType f --extension tsx --hidden

# Exclude build artifacts
fd --extension ts --exclude dist --exclude node_modules

# Find recently changed files (last 4 hours)
fd --fileType f --changedWithin 4h
```

**Rules:**

- Always set `hidden: true` — `.env`, `.eslintrc`, `.babelrc` are hidden by default.
- Use `fileType: "f"` unless you specifically need directories.
- Use `extension` to narrow scope and avoid processing build output.

---

## bat — File Inspection

```
# Read a whole file with line numbers (default)
bat src/components/Button.tsx

# Read a specific line range to reduce noise
bat src/utils/auth.ts --lineRange "40:80"

# Plain output for piping (no decorations, no line numbers)
bat src/config.ts --plain true

# View only lines changed relative to Git index
bat src/api/client.ts --diff true

# Force language detection for ambiguous files
bat .env.example --language dotenv

# Highlight a specific line for focus
bat src/routes/index.ts --lineRange "1:60" --highlightLine "32"
```

**Rules:**

- `bat` defaults to `--paging=never` and line numbers — both are correct for agent use.
- Use `plain: true` when passing output to another tool or writing to a variable.
- Use `diff: true` for review tasks to see only what changed.
- Prefer `lineRange` over reading full files on large sources — reduces token usage.

---

## rg — Pattern Search

```
# Literal string search (safest for source code)
rg --fixedStrings true --pattern "AuthProvider"

# Search with surrounding context
rg --fixedStrings true --pattern "TODO" --context 3

# Search only specific file types
rg --pattern "useEffect" --globs ["*.tsx", "*.ts"]

# Find all files containing a match (no content, just filenames)
rg --fixedStrings true --pattern "deprecated" --filesWithMatches true

# Count matches per file
rg --fixedStrings true --pattern "console.log" --count true

# Case-insensitive search
rg --pattern "apikey" --caseStrategy ignore

# Multiline match (e.g. spanning a function signature)
rg --pattern "export default function\n" --multiline true
```

**Output format:** Results always include `filename:line:column:content`. Parse with that structure in mind.

**Rules:**

- Use `fixedStrings: true` for all literal code searches — dots, brackets, and parens are regex metacharacters.
- Use `context` (2–4 lines) when reviewing logic; skip it when only counting or listing files.
- Use `filesWithMatches: true` to scope a follow-up `bat` or `sd` operation.

---

## sd — Text Replacement

**The mandatory preview-then-apply workflow:**

```
# Step 1: Preview — inspect the diff, never skip this
sd --find "OldComponentName" --replace "NewComponentName"
   --files ["src/components/OldComponentName.tsx"]
   --fixedStrings true --preview true

# Step 2: Apply — only after verifying the preview
sd --find "OldComponentName" --replace "NewComponentName"
   --files ["src/components/OldComponentName.tsx"]
   --fixedStrings true

# Bulk replace across multiple files (combine with fd)
# 1. Discover files
fd --extension ts --hidden --path src/
# 2. Preview across all results
sd --find "oldConfig.endpoint" --replace "newConfig.url"
   --files [<fd results>] --fixedStrings true --preview true
# 3. Apply
sd --find "oldConfig.endpoint" --replace "newConfig.url"
   --files [<fd results>] --fixedStrings true

# Cross-line replacement (e.g. multi-line function signatures)
sd --find "foo(\n  bar" --replace "foo(\n  baz"
   --files ["src/api.ts"] --across true

# Limit replacements (e.g. only first occurrence per file)
sd --find "version" --replace "v" --files ["CHANGELOG.md"]
   --maxReplacements 1
```

**Rules:**

- **Always preview first.** `sd` modifies files in-place with no undo.
- Use `fixedStrings: true` unless you need capture groups or complex patterns.
- Use `across: true` only for cross-line patterns — not needed for single-line replacements.

---

## jq — JSON Extraction (read-only)

```
# Pretty-print a whole file
jq --filter "." package.json

# Extract a nested key
jq --filter ".scripts.build" package.json

# Raw string output (no quotes around result)
jq --filter ".version" --rawOutput true package.json

# List all dependency names as plain text
jq --filter ".dependencies | keys[]" --rawOutput true package.json

# Compact output for piping
jq --filter ".devDependencies" --compact true package.json

# Conditional filtering
jq --filter '.scripts | to_entries[] | select(.value | contains("test"))' package.json
```

**Rules:**

- `jq` is **read-only** in this toolset. The tool returns stdout; it cannot write back to the source file. Do not attempt in-place JSON mutation with `jq`.
- Do not set `colorOutput: true` in agent contexts — output gets piped or logged.
- Use `rawOutput: true` when you need a plain string value, not a JSON-quoted one.
- `jq` is useful beyond `package.json` — apply it to any JSON config, lock file, or API response on disk.

---

## JSON Mutation — Choosing the Right Approach

`jq` reads JSON but cannot write it back. Choose the correct strategy based on what needs to change:

### Tier 1 — Change a scalar value: use `sd`

When you need to change a known string or number value and the key is unique enough to locate safely:

```
# Change a specific value in a JSON config
sd --find '"port": 3000' --replace '"port": 4000'
   --files ["vite.config.json"] --fixedStrings true --preview true
# then apply without preview: true

# Update a version string
sd --find '"version": "1.0.0"' --replace '"version": "1.1.0"'
   --files ["package.json"] --fixedStrings true --preview true
```

**When it's safe:** The pattern is unique in the file, the surrounding whitespace is predictable, and you're changing a leaf value — not moving or nesting keys.

### Tier 2 — Add, remove, or rename a key: use `sd` with care

Possible but fragile. Only attempt when the structure is simple and the match is unambiguous:

```
# Remove a key-value line (single-line value only)
sd --find '  "deprecated": true,\n' --replace ''
   --files ["package.json"] --fixedStrings true --preview true

# Rename a key
sd --find '"oldKey":' --replace '"newKey":'
   --files ["tsconfig.json"] --fixedStrings true --preview true
```

**Limitation:** `sd` operates on text, not structure. It cannot safely remove a key whose value spans multiple lines, and it cannot reorder keys. If the pattern isn't unique or the value is multi-line, do not attempt this with `sd`.

### Tier 3 — Restructure, reorder, or deeply transform: not possible with current tools

**No tool in this set can safely reorder JSON keys or perform structural transformations.**

`jq` can compute the correct output but cannot write it back to the file.
`sd` can find and replace text but cannot reason about JSON structure.

When a task requires this, do one of the following — in order of preference:

1. **Use `jq` to generate the correct output, show it to the user, and ask them to apply it.**
   Read the file with `jq`, compute the desired structure, present the result, and explain that the write step needs to be done manually or with a JSON-aware editor.

2. **Use `sd` for the parts that are safe** (scalar value changes) and clearly document which parts still need manual attention.

3. **Do not attempt the full rewrite with `sd` regex patterns.** Regex against structured JSON is brittle — whitespace variations, comment-style fields, and multi-line values will cause silent corruption. If it can't be done cleanly, say so explicitly rather than producing a fragile one-liner.
