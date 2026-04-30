---
name: code-review
description: Review code with bat, rg, and fd for comprehensive analysis
---

## What I do

I provide a structured workflow for auditing codebases, identifying patterns, and reviewing recent changes with high-visibility tools.

## Workflow

1. Use `fd` to narrow down the review scope.
   - By Extension: `fd -e ts -e tsx`
   - Recent Changes: `fd -t f --changed-within 1d` (Finds files modified in the last 24 hours)
   - Exclude Binaries: `fd` excludes these by default, keeping the review clean.
2. Use `rg` for pattern matching.
   - Literal Search: Use `-F` for fixed strings (e.g., `rg -F "Component.displayName"`) to avoid regex overhead.
   - Context: Use `-C 2` to see the surrounding lines for better understanding.
   - Stats: Use `--stats` to see a summary of matches and files searched.
3. Use `bat` for a rich file viewing experience.
   - Range Review: `bat -r 10:50 [file]` to focus on specific logic blocks.
   - Integration: `bat --diff` (if available in your env) to view changes relative to git.
   - Clean Output: Use `-pp` for a completely decoration-free output if piping to another tool.
4. Use `eza` to understand the project layout and git status.
   - Git Status: `eza --long --git` to see which files are modified (`M`), new (`A`), or ignored.
   - Tree View: `eza --tree --level 3 --ignore-glob "node_modules|.git"` to visualize project architecture without noise.

## Example

```bash
# 1. Find all recently changed TypeScript files
fd -e ts --changed-within 4h

# 2. Search for sensitive console logs with 2 lines of context
rg "console\.(log|debug|warn)" src/ -C 2

# 3. Review the specific range where an issue was found
bat src/utils/logger.ts -r 20:45 --highlight-line 32

# 4. Check the directory structure and git status of the affected module
eza -lT --git --level 2 src/utils/
```

## Review Checklist

- [ ] Cleanup: No `TODO`, `FIXME`, or `console.log` (use `rg`).
- [ ] Structure: Module depth is manageable (use `eza --tree`).
- [ ] Dependencies: `package.json` changes align with `jq` analysis.
- [ ] Formatting: Files are standard (use `vp --check`).
