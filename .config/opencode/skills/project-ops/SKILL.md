---
name: project-ops
description: >
  Manage the full project lifecycle with vp (Vite+). Use for installing
  dependencies, running the dev server, building, testing, linting,
  formatting, scaffolding, and auditing the dependency graph. vp
  auto-detects the project's package manager from lockfiles, so it works
  correctly whether the project uses pnpm, npm, yarn, or bun — always
  use vp, never invoke the underlying package manager directly.
---

## What I do

I provide authoritative workflows for every stage of a web project using Vite+ (`vp`). `vp` is a unified zero-config toolchain that wraps Vite, Vitest, Oxlint, Oxfmt, Rolldown, tsdown, and Vite Task — plus automatic package manager detection.

## Tool Selection: Always `vp`

`vp` detects the correct package manager from the project's lockfile:

| Lockfile present    | Package manager used by `vp` |
| :------------------ | :--------------------------- |
| `bun.lockb`         | bun                          |
| `pnpm-lock.yaml`    | pnpm (default fallback)      |
| `package-lock.json` | npm                          |
| `yarn.lock`         | yarn                         |

**Never invoke `npm`, `yarn`, `pnpm`, `bun`, or `npx` directly.** Even in a Bun project, run `vp` — it will delegate to bun automatically. `vp` is the single entry point for all project tasks regardless of what package manager the project uses underneath.

---

## Workflow Reference

### Scaffolding & Migration

```
vp create          ← scaffold a new project from a template
vp migrate         ← migrate an existing project to Vite+ (merges .oxlintrc,
                      .oxfmtrc, lint-staged config into vite.config.ts)
vp config          ← configure hooks and agent integration
vp env             ← manage Node.js versions globally or per project
```

### Dependency Management

```
vp install         ← install all dependencies (alias: vp i)
vp add react
vp add -D typescript
vp remove lodash   ← aliases: vp rm, vp un, vp uninstall
vp update          ← aliases: vp up
vp dedupe          ← deduplicate the dependency tree
vp outdated        ← list stale packages
vp list            ← list installed packages (alias: vp ls)
vp why react       ← show why a package is in the tree (alias: vp explain)
vp info zod        ← view package metadata from registry (aliases: vp view, vp show)
vp link            ← manage local package links (alias: vp ln)
vp pm <cmd>        ← forward a raw command to the underlying package manager
```

### Development

```
vp dev             ← Vite dev server with instant HMR
vp check           ← format + lint + type-check in one command
vp lint            ← Oxlint only
vp fmt             ← Oxfmt only
vp test            ← Vitest
vp staged          ← run linters on staged files only (pre-commit hook)
```

> **`vp check` vs individual commands:** Always prefer `vp check` before
> declaring a review clean — it runs fmt, lint, and type-check together.
> Use `vp lint` or `vp fmt` individually only when targeting a specific tool.

### Execution

```
vp run <task>      ← run monorepo tasks with caching and dep-aware scheduling
vp exec <bin>      ← execute a binary from local node_modules/.bin
vp dlx <pkg>       ← execute a package binary without installing it (replaces npx)
vp cache           ← manage the task runner cache
```

### Build & Release

```
vp build           ← production build via Vite + Rolldown
vp pack            ← build libraries for npm or standalone binaries
vp preview         ← preview the production build locally
```

### Maintenance

```
vp upgrade         ← update vp itself to the latest version
```

---

## Manifest Inspection (with `jq`)

Use `jq` for structured reads of `package.json`.

```
# View all scripts
jq  filter: ".scripts"  filepath: "package.json"

# List direct dependencies
jq  filter: ".dependencies"  filepath: "package.json"

# List dev dependencies
jq  filter: ".devDependencies"  filepath: "package.json"

# Get a plain string value (no JSON quotes around the result)
jq  filter: ".version"  filepath: "package.json"  rawOutput: true

# Find @types packages accidentally in production deps
jq  filter: '.dependencies | keys[] | select(startswith("@types/"))'
    filepath: "package.json"  rawOutput: true
```

---

## vite.config.ts — Unified Configuration

All Vite+ tools are configured from a single `vite.config.ts`. Use `vp migrate`
to consolidate existing tool-specific config files into this format.

```ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [], // Vite dev/build

  test: { include: ["src/**/*.test.ts"] }, // Vitest  (vp test)
  lint: { ignorePatterns: ["dist/**"] }, // Oxlint  (vp lint / vp check)
  fmt: { semi: true, singleQuote: true }, // Oxfmt   (vp fmt  / vp check)

  run: {
    // Vite Task (vp run)
    tasks: {
      "generate:icons": { command: "node scripts/generate-icons.js" },
    },
  },

  staged: { "*": "vp check --fix" }, // vp staged (pre-commit)
});
```

---

## GitHub Actions

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    node-version: "22"
    cache: true
```

---

## Notes

- `vp` sets `CI=true` and `FORCE_COLOR=0` automatically — clean output for agent logs.
- `vp staged` is faster than `vp check` in pre-commit contexts; it only processes git-staged files.
- `vp run` supports caching and dependency-aware task scheduling — prefer it over raw `vp exec` for multi-step workflows.
- `vp dlx` replaces `npx` entirely — never use `npx` directly.
- `jq` defaults to monochrome output — never set `colorOutput: true` in agent contexts.
