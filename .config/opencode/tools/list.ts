import { tool } from '@opencode-ai/plugin';
import { argv } from '../lib/argv';
import { stream } from '../lib/stream';

export default tool({
  description:
    'List files and directories with rich metadata using eza. Shows permissions, sizes, modification times, git status, and tree structures. Use instead of ls or tree. For locating files by name or attribute, use find instead.',
  args: {
    path: tool.schema
      .string()
      .optional()
      .describe('Directory or file path to list. Defaults to the current working directory.'),
    all: tool.schema
      .boolean()
      .optional()
      .describe('Show hidden files and dotfiles (entries starting with a dot).'),
    long: tool.schema
      .boolean()
      .optional()
      .describe(
        'Display extended metadata in a table: permissions, owner, size, and modification time.',
      ),
    tree: tool.schema
      .boolean()
      .optional()
      .describe('Recurse into subdirectories and render as a tree. Pair with level to cap depth.'),
    git: tool.schema
      .boolean()
      .optional()
      .describe(
        'Show the Git status of each file alongside its name (new, modified, ignored, etc.).',
      ),
    sort: tool.schema
      .enum([
        'name',
        'Name',
        'extension',
        'Extension',
        'size',
        'type',
        'modified',
        'accessed',
        'created',
        'inode',
        'none',
      ])
      .optional()
      .describe('Column to sort by. "Name" and "Extension" are case-insensitive variants.'),
    reverse: tool.schema
      .boolean()
      .optional()
      .describe('Reverse the sort order (e.g., newest-first when sorting by modified).'),
    groupDirsFirst: tool.schema
      .boolean()
      .optional()
      .describe('List all directories before files, regardless of sort order.'),
    level: tool.schema
      .number()
      .optional()
      .describe('Maximum recursion depth when using tree or recurse. 1 = immediate children.'),
    ignoreGlob: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Glob patterns for entries to hide from output. Example: ["*.log", "dist"] cleans up noisy directories.',
      ),
    gitIgnore: tool.schema
      .boolean()
      .optional()
      .describe('Hide files that are excluded by .gitignore rules.'),
    oneline: tool.schema
      .boolean()
      .optional()
      .describe('Print one entry per line with no columns. Useful for piping to another tool.'),
    recurse: tool.schema
      .boolean()
      .optional()
      .describe(
        'List contents of subdirectories recursively without the tree visualization. Use tree: true for a visual tree instead.',
      ),
    onlyDirs: tool.schema.boolean().optional().describe('Show directories only, no files.'),
    onlyFiles: tool.schema.boolean().optional().describe('Show files only, no directories.'),
    dereference: tool.schema
      .boolean()
      .optional()
      .describe('Show metadata for the target of symbolic links instead of the link itself.'),
    classify: tool.schema
      .boolean()
      .optional()
      .describe('Append a type indicator to each name: "/" for directories, "*" for executables.'),
    treatDirsAsFiles: tool.schema
      .boolean()
      .optional()
      .describe('List directory entries without descending into them.'),
    extended: tool.schema
      .boolean()
      .optional()
      .describe('Show extended attributes (xattrs) and their sizes alongside each file.'),
    header: tool.schema
      .boolean()
      .optional()
      .describe('Add a header row labeling each column. Most useful with long: true.'),
  },
  execute(args, context) {
    return stream(
      () =>
        Promise.resolve({
          cmd: 'eza',
          flags: argv(args, {
            fixed: ['--color=never', '--icons=never', '--no-quotes'],
            mapping: {
              all: '--all',
              long: '--long',
              tree: '--tree',
              git: '--git',
              sort: '--sort',
              reverse: '--reverse',
              groupDirsFirst: '--group-directories-first',
              level: '--level',
              gitIgnore: '--git-ignore',
              oneline: '--oneline',
              recurse: '--recurse',
              onlyDirs: '--only-dirs',
              onlyFiles: '--only-files',
              dereference: '--dereference',
              classify: '--classify',
              treatDirsAsFiles: '--treat-dirs-as-files',
              extended: '--extended',
              header: '--header',
              ignoreGlob: { flag: '--ignore-glob', style: 'repeat' },
            },
            positional: [args.path ?? '.'],
          }),
          cwd: context.directory || context.worktree,
        }),
      [args, context],
    );
  },
});
