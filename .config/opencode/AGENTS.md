# Agent Instructions (Global)

## Always Use Custom Tools

**These built-in tools are BANNED. Use the custom replacements:**

| Banned Built-in           | Custom Tool Required |
| :------------------------ | :------------------- |
| `read`                    | `bat`                |
| `glob`                    | `fd`                 |
| `grep`                    | `rg`                 |
| `bash` with `cat`         | `bat`                |
| `bash` with `find`        | `fd`                 |
| `bash` with `ls` / `tree` | `eza`                |
| `bash` with `sed`         | `sd`                 |
| `npm` / `yarn` / `pnpm`   | `vp`                 |
| `npx`                     | `vp dlx`             |

---

## When to Load the `toolchain` Skill

Load `toolchain` before starting any coding task. It contains quick-start examples, tool routing, and per-tool flag references.

| You need to…                                    | Tool  |
| :---------------------------------------------- | :---- |
| Read or inspect a file                          | `bat` |
| Find files by name, type, or pattern            | `fd`  |
| Search text or patterns across the codebase     | `rg`  |
| Replace or refactor text in files               | `sd`  |
| View directory structure or git status          | `eza` |
| Extract or query values from JSON               | `jq`  |
| Install, build, test, lint, run, or manage deps | `vp`  |
| Run bun-specific runtime scripts or tests       | `bun` |

---

## Safety Guardrails

- **No direct package manager calls** — always `vp`; it auto-detects the lockfile.
- **No paging** — `bat` defaults to `--paging=never`. Never override.
- **`fd` hidden** — always set `hidden: true` or dotfiles will be missed.
- **`sd` preview** — always `preview: true` first. There is no undo.
- **`jq` read-only** — it cannot write back to files.
- **No color** — `bat`, `rg`, `eza`, `jq` all default to no color. Never enable color flags in agent contexts.
