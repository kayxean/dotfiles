---
name: toolchain
description: Complete workflow skill for coding tasks using custom CLI tools: bat (read files), fd (find files), rg (search text), sd (replace text), eza (directory/git layout), jq (query JSON), vp (project lifecycle), bun (bun runtime). Use when reading, searching, editing, or navigating files, running builds, tests, or managing dependencies. Always prefer these tools over built-in read/glob/grep.
---

# Toolchain Skill

## Quick start

```
# Read a file with line numbers
bat filepath: "src/auth.ts" lineRange: "1:60"

# Find TypeScript files (always include hidden)
fd hidden: true fileType: "f" extension: ["ts", "tsx"]

# Search for a pattern in source
rg pattern: "AuthProvider" fixedStrings: true paths: ["src/"]

# Replace text — always preview first
sd find: "OldName" replace: "NewName" files: ["src/auth.ts"] fixedStrings: true preview: true

# Project structure + git status
eza tree: true git: true level: 3 ignoreGlob: ["node_modules", ".git", "dist"]

# Extract from JSON
jq filter: ".scripts" filepath: "package.json"

# Project task (install / build / test / lint)
vp command: "check"

# Bun-specific runtime (use sparingly — prefer vp)
bun command: "run" args: ["scripts/codegen.ts"]
```

## Tool routing

| When you need to…                      | Tool  | Flags                      |
| :------------------------------------- | :---- | :------------------------- |
| Read or inspect a file                 | `bat` | [bat.yaml](flags/bat.yaml) |
| Find files by name, type, or extension | `fd`  | [fd.yaml](flags/fd.yaml)   |
| Search text or patterns across files   | `rg`  | [rg.yaml](flags/rg.yaml)   |
| Replace or refactor text in files      | `sd`  | [sd.yaml](flags/sd.yaml)   |
| Browse directory structure / git state | `eza` | [eza.yaml](flags/eza.yaml) |
| Query or extract values from JSON      | `jq`  | [jq.yaml](flags/jq.yaml)   |
| Install, build, test, lint, run tasks  | `vp`  | [vp.yaml](flags/vp.yaml)   |
| Bun runtime scripts, watch, bundler    | `bun` | [bun.yaml](flags/bun.yaml) |

See [REFERENCE.md](REFERENCE.md) for consolidated examples.

## Common workflows

### Find → inspect → modify

```
1. fd hidden: true fileType: "f" pattern: "auth"
2. bat filepath: <result> lineRange: "1:80"
3. sd find: "old" replace: "new" files: [<result>] fixedStrings: true preview: true
4. sd find: "old" replace: "new" files: [<result>] fixedStrings: true
5. vp command: "check"
```

### Global refactor

```
1. rg pattern: "OldName" fixedStrings: true filesWithMatches: true paths: ["src/"]
2. sd find: "OldName" replace: "NewName" files: [<rg results>] fixedStrings: true preview: true
3. sd find: "OldName" replace: "NewName" files: [<same list>] fixedStrings: true
```

### Code review

```
1. eza tree: true git: true level: 3
2. bat filepath: <changed file> diff: true
3. rg pattern: "console.log" fixedStrings: true paths: ["src/"]
4. vp command: "staged"
```

### Explore a project

```
1. eza tree: true git: true level: 3 ignoreGlob: ["node_modules", ".git", "dist"]
2. bat filepath: "package.json"
3. jq filter: ".scripts" filepath: "package.json"
4. vp command: "outdated"
```
