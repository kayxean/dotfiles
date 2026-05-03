import { tool } from '@opencode-ai/plugin';
import { argv } from '../lib/argv';
import { stream } from '../lib/stream';

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
  execute(args, context) {
    const searchPath = args.path ?? context.directory ?? context.worktree ?? '.';

    return stream(
      () =>
        Promise.resolve({
          cmd: 'fd',
          flags: argv(args, {
            fixed: ['--color=never'],
            mapping: {
              hidden: '--hidden',
              noIgnore: '--no-ignore',
              glob: '--glob',
              fixedStrings: '--fixed-strings',
              absolutePath: '--absolute-path',
              follow: '--follow',
              fullPath: '--full-path',
              prune: '--prune',
              oneFileSystem: '--one-file-system',
              maxDepth: '--max-depth',
              minDepth: '--min-depth',
              maxResults: '--max-results',
              fileType: '--type',
              fileSize: '--size',
              changedWithin: '--changed-within',
              changedBefore: '--changed-before',
              owner: '--owner',
              extension: { flag: '--extension', style: 'repeat' },
              exclude: { flag: '--exclude', style: 'repeat' },
              and: { flag: '--and', style: 'repeat' },
            },
            positional: [args.pattern, searchPath],
          }),
          cwd: context.directory || context.worktree,
          exitCodeMap: { 0: 'success', 1: 'success' },
        }),
      [args, context],
    );
  },
});
