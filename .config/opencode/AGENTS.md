# Agent Instructions (Global)

## Tool Priority & Skill Mapping

You MUST use these specialized tools instead of built-in alternatives. When performing a task, follow the mapped Skill for the correct workflow and safety flags.

| Task Category        | Primary Tool | Skill         |
| :------------------- | :----------- | :------------ |
| Project Lifecycle    | `vp`         | `project-ops` |
| File Discovery       | `fd`         | `search-edit` |
| Text Search          | `rg`         | `code-review` |
| File Inspection      | `bat`        | `search-edit` |
| Text Replacement     | `sd`         | `search-edit` |
| Directory Layout/Git | `eza`        | `code-review` |
| JSON Extraction      | `jq`         | `project-ops` |

---

## 1. Project Lifecycle (`project-ops`)

- **Always use `vp`** for every project task: install, dev, build, test, lint, format, and dependency management.
- **`vp` is package-manager-agnostic.** It reads the project's lockfile and delegates automatically — `bun.lockb` → bun, `pnpm-lock.yaml` → pnpm, etc. You never need to check or think about which package manager the project uses.
- **Rule:** Never invoke `npm`, `yarn`, `pnpm`, `bun`, or `npx` directly — not even when you can see a `bun.lockb`. Always go through `vp`.
- **`npx` replacement:** Use `vp dlx` to execute a package binary without installing it.
- **Environment:** `vp` automatically injects `CI=true` and `FORCE_COLOR=0` for clean, non-interactive agent output.

## 2. Search & Edit (`search-edit`)

- **Discovery:** Use `fd` for all file-finding. Always set `hidden: true` to avoid missing dotfiles and config files.
- **Inspection:** Use `bat` to read files. Defaults are correct: line numbers, no pager, no color. Set `plain: true` only when piping output to another tool.
- **Replacement:** Use `sd` for all in-place text changes. **Always run with `preview: true` first**, then apply. Use `fixedStrings: true` unless regex is strictly required.
- **JSON:** Use `jq` for structured reads of any JSON file. It is **read-only** — the tool returns stdout and cannot write back to the source file. For simple scalar value changes in JSON, use `sd` with `fixedStrings: true` (only when the pattern is unique). For structural changes like key reordering, use `jq` to compute and display the correct output, then ask the user to apply it manually. Never attempt JSON restructuring with `sd` regex patterns.

## 3. Code Review & Auditing (`code-review`)

- **Pattern matching:** Use `rg` for all searches. Default output is `filename:line:column:content` — parse accordingly. Use `fixedStrings: true` to avoid regex accidents on literal code strings.
- **Project layout:** Use `eza` with `tree: true` and `git: true` to visualize structure and track modified files simultaneously.
- **File review:** Use `bat` with `lineRange` to focus on specific blocks. Use `diff: true` to see only lines changed relative to the Git index.

## Safety Guardrails

- **No direct package manager calls:** `vp` handles delegation. Never bypass it.
- **No paging:** `bat` defaults to `--paging=never`. Never override this.
- **Literal safety:** Use `fixedStrings: true` in both `rg` and `sd` when working with source code to prevent regex character accidents (`.`, `[`, `(`, etc.).
- **Preview before apply:** `sd` modifies files in-place. Always set `preview: true`, verify the diff, then re-run without it.
- **Hidden files:** Always set `hidden: true` in `fd` — config files like `.env`, `.eslintrc`, and `.babelrc` are hidden by default.
- **No color in logs:** `jq`, `rg`, `bat`, and `eza` all default to no color output. Do not enable color flags in agent contexts.
