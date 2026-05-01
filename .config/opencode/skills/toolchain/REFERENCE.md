# Toolchain Reference — Examples

## Bat Examples

```bash
# Basic read
bat filepath: "src/main.ts"

# Read specific range
bat filepath: "src/main.ts" lineRange: "10:20"

# Inspect Git changes
bat filepath: "src/main.ts" diff: true

# Plain output for piping
bat filepath: "package.json" plain: true
```

## Bun Examples

```bash
# Run a script
bun command: "run" args: ["scripts/codegen.ts"]

# Run tests
bun command: "test"

# Install dependencies
bun command: "install"

# Execute a package without installing
bun command: "x" args: ["some-package"]
```

## Eza Examples

```bash
# Visualize project structure with git status
eza tree: true git: true level: 3 ignoreGlob: ["node_modules", ".git", "dist"]

# Detailed list of files
eza path: "src/" long: true

# List only directories
eza path: "src/" onlyDirs: true

# Sort by modification time
eza path: "src/" sort: "modified" reverse: true
```

## Fd Examples

```bash
# Find TypeScript files (always include hidden)
fd hidden: true fileType: "f" extension: ["ts", "tsx"]

# Search for a pattern in a specific path
fd pattern: "auth" path: "src/" hidden: true fileType: "f"

# Find recently modified files (via CLI - logic handled by fd)
fd hidden: true fileType: "f" pattern: ".*"

# Find files matching multiple patterns
fd pattern: "user" and: ["auth", "service"] hidden: true
```

## Jq Examples

```bash
# Extract scripts from package.json
jq filter: ".scripts" filepath: "package.json"

# Get version as plain string
jq filter: ".version" filepath: "package.json" rawOutput: true

# List all dependencies keys
jq filter: ".dependencies | keys[]" filepath: "package.json" rawOutput: true

# Compact output for devDependencies
jq filter: ".devDependencies" filepath: "package.json" compact: true
```

## Rg Examples

```bash
# Search for a literal string (safe for code)
rg pattern: "AuthProvider" fixedStrings: true

# Search for pattern with surrounding context
rg pattern: "useEffect" fixedStrings: true context: 3

# Search for a pattern across specific source files
rg pattern: "deprecated" fixedStrings: true paths: ["src/utils/api.ts", "src/api/client.ts"]

# Find all files containing a specific term to scope follow-up task
rg pattern: "TODO" fixedStrings: true filesWithMatches: true paths: ["src/"]

# Search for multiline pattern
rg pattern: "export default function\n" multiline: true
```

## Sd Examples

```bash
# Step 1: Preview changes (MANDATORY)
sd find: "OldComponentName" replace: "NewComponentName" files: ["src/components/OldComponentName.tsx"] fixedStrings: true preview: true

# Step 2: Apply changes
sd find: "OldComponentName" replace: "NewComponentName" files: ["src/components/OldComponentName.tsx"] fixedStrings: true

# Bulk replace across multiple files
sd find: "oldConfig.endpoint" replace: "newConfig.url" files: ["src/api.ts", "src/utils/url.ts"] fixedStrings: true preview: true

# Cross-line replacement
sd find: "foo(\n  bar" replace: "foo(\n  baz" files: ["src/api.ts"] across: true

# Limit replacements per file
sd find: "version" replace: "v" files: ["CHANGELOG.md"] maxReplacements: 1
```

## Vp Examples

```bash
# Quality check (Preferred: runs fmt, lint, and type check)
vp command: "check"

# Run development server
vp command: "dev"

# Add a new dependency
vp command: "add" args: ["react"]

# Run a custom script defined in package.json
vp command: "run" args: ["build:docs"]

# Execute a package binary without installing
vp command: "dlx" args: ["create-next-app"]

# Check for outdated packages
vp command: "outdated"
```
