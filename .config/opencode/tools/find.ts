import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

export default tool({
  description:
    'Locate files and directories by name, type, extension, size, or modification time using fd. Faster and more ergonomic than find. Use this when you need to know where a file is — not what is inside it. For searching file contents, use text instead.',
  args: {
    pattern: tool.schema
      .string()
      .optional()
      .describe(
        'Pattern to match against file and directory names. Regex by default; pass glob: true to switch to glob syntax. Omit to match everything (useful with other filters).',
      ),
    path: tool.schema
      .string()
      .optional()
      .describe(
        'Root directory to start the search from. Defaults to the current working directory.',
      ),
    hidden: tool.schema
      .boolean()
      .optional()
      .describe(
        'Include hidden files and directories (names starting with a dot). Almost always correct to enable — config files and dotfiles live here.',
      ),
    noIgnore: tool.schema
      .boolean()
      .optional()
      .describe(
        'Include files that are excluded by .gitignore, .ignore, or .fdignore rules. Use when searching build artifacts or generated files.',
      ),
    glob: tool.schema
      .boolean()
      .optional()
      .describe('Interpret pattern as a glob (e.g., "*.test.ts") instead of a regular expression.'),
    fixedStrings: tool.schema
      .boolean()
      .optional()
      .describe(
        'Treat pattern as a literal string — no regex interpretation. Use when the filename contains dots, brackets, or other metacharacters.',
      ),
    absolutePath: tool.schema
      .boolean()
      .optional()
      .describe('Return absolute paths. Useful when the result will be passed to another tool.'),
    maxDepth: tool.schema
      .number()
      .optional()
      .describe(
        'Stop descending after this many directory levels. 1 = immediate children only, 2 = one level of subdirectories, etc.',
      ),
    minDepth: tool.schema
      .number()
      .optional()
      .describe(
        'Skip entries shallower than this depth. Use to exclude the root directory itself.',
      ),
    extension: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Filter by file extension(s). No leading dot. Example: ["ts", "tsx"] matches all TypeScript files.',
      ),
    fileType: tool.schema
      .enum(['f', 'file', 'd', 'dir', 'l', 'symlink', 'x', 'executable', 'e', 'empty'])
      .optional()
      .describe(
        'Filter by entry type. "file" for regular files, "dir" for directories, "symlink" for symbolic links, "executable" for runnable files, "empty" for zero-byte files or empty directories.',
      ),
    exclude: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Glob patterns for files or directories to exclude. Example: ["node_modules", "dist"] keeps results clean in JS projects.',
      ),
    follow: tool.schema
      .boolean()
      .optional()
      .describe('Follow symbolic links and descend into the directories they point to.'),
    fileSize: tool.schema
      .string()
      .optional()
      .describe(
        'Filter by file size. Prefix with "+" for larger than, "-" for smaller than. Units: b, k, m, g. Example: "+50k" finds files over 50 KB.',
      ),
    changedWithin: tool.schema
      .string()
      .optional()
      .describe(
        'Include only files modified more recently than this duration or date. Examples: "1d" (last day), "2weeks", "2024-01-15".',
      ),
    changedBefore: tool.schema
      .string()
      .optional()
      .describe(
        'Include only files modified before this duration or date. Same format as changedWithin.',
      ),
    owner: tool.schema
      .string()
      .optional()
      .describe(
        'Filter by file owner in "user:group" format. Either part can be omitted: "alice" matches by user only, ":staff" matches by group only.',
      ),
    maxResults: tool.schema
      .number()
      .optional()
      .describe(
        'Stop after finding this many results. Use when you only need the first match or a small sample — avoids walking the entire tree.',
      ),
    fullPath: tool.schema
      .boolean()
      .optional()
      .describe(
        'Match pattern against the full path, not just the filename. Useful for finding files in a specific subdirectory structure.',
      ),
    and: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Additional patterns that must all match alongside the main pattern. Effectively ANDs multiple conditions together.',
      ),
    prune: tool.schema
      .boolean()
      .optional()
      .describe(
        'Do not recurse into directories that match the search criteria. Use to find top-level matches only.',
      ),
    oneFileSystem: tool.schema
      .boolean()
      .optional()
      .describe(
        'Do not cross filesystem boundaries. Prevents the walk from entering mounted drives or network shares.',
      ),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const cwd = directory || worktree;

    const extensionFlags = (args.extension ?? []).map((ext) => `--extension ${shellEscape(ext)}`);
    const excludeFlags = (args.exclude ?? []).map((p) => `--exclude ${shellEscape(p)}`);
    const andFlags = (args.and ?? []).map((p) => `--and ${shellEscape(p)}`);

    const pattern = args.pattern ? shellEscape(args.pattern) : '';
    const searchPath = args.path ?? cwd ?? '.';

    const cmd = [
      'fd',
      '--color=never',
      ...(args.hidden ? ['--hidden'] : []),
      ...(args.noIgnore ? ['--no-ignore'] : []),
      ...(args.glob ? ['--glob'] : []),
      ...(args.fixedStrings ? ['--fixed-strings'] : []),
      ...(args.absolutePath ? ['--absolute-path'] : []),
      ...(args.follow ? ['--follow'] : []),
      ...(args.fullPath ? ['--full-path'] : []),
      ...(args.prune ? ['--prune'] : []),
      ...(args.oneFileSystem ? ['--one-file-system'] : []),
      ...(args.maxDepth ? [`--max-depth ${args.maxDepth}`] : []),
      ...(args.minDepth ? [`--min-depth ${args.minDepth}`] : []),
      ...(args.maxResults ? [`--max-results ${args.maxResults}`] : []),
      ...(args.fileType ? [`--type ${args.fileType}`] : []),
      ...(args.fileSize ? [`--size ${shellEscape(args.fileSize)}`] : []),
      ...(args.changedWithin ? [`--changed-within ${shellEscape(args.changedWithin)}`] : []),
      ...(args.changedBefore ? [`--changed-before ${shellEscape(args.changedBefore)}`] : []),
      ...(args.owner ? [`--owner ${shellEscape(args.owner)}`] : []),
      ...extensionFlags,
      ...excludeFlags,
      ...andFlags,
      pattern,
      searchPath,
    ].join(' ');

    const result: CommandResult = await execAsync(cmd, {
      cwd,
      signal: abort,
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024,
    })
      .then((res) => ({ success: true, ...res }) as const)
      .catch(
        (err: unknown) =>
          ({
            success: false,
            error: err instanceof Error ? err : new Error(String(err)),
          }) as const,
      );

    if (!result.success) {
      const err = result.error as Error & { code?: number | string; stderr?: string };
      if (err.code === 1 || err.code === '1') {
        return {
          output: '',
          metadata: {
            info: 'No files found matching the criteria.',
            exitCode: 1,
            command: cmd,
          },
        };
      }

      return {
        output: `Error executing fd: ${err.message}`,
        metadata: {
          exitCode: err.code ?? -1,
          stderr: err.stderr,
          command: cmd,
        },
      };
    }

    return {
      output: result.stdout,
      metadata: {
        stderr: result.stderr || undefined,
        command: cmd,
        directory,
      },
    };
  },
});
