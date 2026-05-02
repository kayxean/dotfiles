import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

export default tool({
  description:
    'Search for text patterns inside files using ripgrep. Fast, respects .gitignore, and supports regex, literal, and multi-line modes. Use this to find where something appears in the codebase. For locating files by name rather than content, use find instead.',
  args: {
    pattern: tool.schema
      .string()
      .describe(
        'Pattern to search for. Regex by default. Use fixedStrings: true for literal text. Use engine: "pcre2" for advanced features like lookahead.',
      ),
    paths: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Files or directories to search. Defaults to the current directory. Narrowing this to a specific directory or file speeds up the search significantly.',
      ),
    fixedStrings: tool.schema
      .boolean()
      .optional()
      .describe(
        'Treat pattern as a plain string — no regex interpretation. Use when the search text contains dots, parentheses, or other metacharacters.',
      ),
    engine: tool.schema
      .enum(['default', 'pcre2', 'auto'])
      .optional()
      .describe(
        'Regex engine. "pcre2" enables lookahead, lookbehind, and named capture groups. "auto" uses PCRE2 only when the pattern requires it.',
      ),
    caseStrategy: tool.schema
      .enum(['sensitive', 'ignore', 'smart'])
      .optional()
      .describe(
        'Case sensitivity. "sensitive" (default) is exact. "ignore" is case-insensitive. "smart" is case-insensitive unless the pattern contains an uppercase letter.',
      ),
    globs: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Glob patterns to include or exclude files. Prefix with "!" to exclude. Example: ["*.ts", "!*.test.ts"] searches TypeScript source but skips test files.',
      ),
    hidden: tool.schema
      .boolean()
      .optional()
      .describe(
        'Search inside hidden files and directories (names starting with a dot). Excluded by default.',
      ),
    maxDepth: tool.schema
      .number()
      .optional()
      .describe('Stop descending into subdirectories after this many levels.'),
    multiline: tool.schema
      .boolean()
      .optional()
      .describe(
        'Allow the pattern to match across multiple lines. Required when searching for patterns that span line boundaries.',
      ),
    context: tool.schema
      .number()
      .optional()
      .describe(
        'Number of lines to show before and after each match. Useful for understanding the surrounding code without opening the file.',
      ),
    maxCount: tool.schema
      .number()
      .optional()
      .describe('Stop after finding this many matching lines per file.'),
    invertMatch: tool.schema
      .boolean()
      .optional()
      .describe('Print lines that do NOT match the pattern.'),
    noIgnore: tool.schema
      .boolean()
      .optional()
      .describe('Search files excluded by .gitignore or .ignore rules.'),
    typeList: tool.schema
      .boolean()
      .optional()
      .describe(
        'Print all file type names that ripgrep recognizes. Use this to discover what to pass to globs.',
      ),
    count: tool.schema
      .boolean()
      .optional()
      .describe('Print only the number of matching lines per file, not the lines themselves.'),
    filesWithMatches: tool.schema
      .boolean()
      .optional()
      .describe(
        'Print only the file paths that contain at least one match — no line content. Fastest option when you just need to know which files are affected.',
      ),
    onlyMatching: tool.schema
      .boolean()
      .optional()
      .describe('Print only the matched portion of each line, not the full line.'),
    replace: tool.schema
      .string()
      .optional()
      .describe(
        'Replace matched text with this string in the output (does not modify files). Useful for previewing what a replacement would look like.',
      ),
    passthru: tool.schema
      .boolean()
      .optional()
      .describe(
        'Print every line — both matching and non-matching. Matches are still highlighted. Useful for viewing a file with matches called out.',
      ),
    wordRegexp: tool.schema
      .boolean()
      .optional()
      .describe(
        'Only match when the pattern aligns with a whole word boundary. Prevents "foo" from matching inside "foobar".',
      ),
    follow: tool.schema
      .boolean()
      .optional()
      .describe('Follow symbolic links when traversing directories.'),
    maxFilesize: tool.schema
      .string()
      .optional()
      .describe(
        'Skip files larger than this size. Format: number + unit. Example: "1M" skips files over 1 megabyte.',
      ),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const cwd = directory || worktree;

    if (args.typeList) {
      const cmd = 'rg --type-list';
      const { stdout, stderr } = await execAsync(cmd, { cwd, signal: abort });
      return { output: stdout, metadata: { stderr: stderr || undefined, command: cmd, directory } };
    }

    const globFlags = (args.globs ?? []).map((g) => `--glob ${shellEscape(g)}`);
    const targetPaths = args.paths?.length ? args.paths.map(shellEscape) : ['.'];

    const cmd = [
      'rg',
      '--color=never',
      '--no-heading',
      '--with-filename',
      '--line-number',
      '--column',
      ...(args.fixedStrings ? ['--fixed-strings'] : []),
      ...(args.hidden ? ['--hidden'] : []),
      ...(args.noIgnore ? ['--no-ignore'] : []),
      ...(args.multiline ? ['--multiline'] : []),
      ...(args.invertMatch ? ['--invert-match'] : []),
      ...(args.count ? ['--count'] : []),
      ...(args.filesWithMatches ? ['--files-with-matches'] : []),
      ...(args.onlyMatching ? ['--only-matching'] : []),
      ...(args.passthru ? ['--passthru'] : []),
      ...(args.wordRegexp ? ['--word-regexp'] : []),
      ...(args.follow ? ['--follow'] : []),
      ...(args.engine ? [`--engine=${args.engine}`] : []),
      ...(args.maxDepth ? [`--max-depth ${args.maxDepth}`] : []),
      ...(args.context ? [`--context ${args.context}`] : []),
      ...(args.maxCount ? [`--max-count ${args.maxCount}`] : []),
      ...(args.replace ? [`--replace ${shellEscape(args.replace)}`] : []),
      ...(args.maxFilesize ? [`--max-filesize ${shellEscape(args.maxFilesize)}`] : []),
      ...(args.caseStrategy === 'ignore'
        ? ['--ignore-case']
        : args.caseStrategy === 'smart'
          ? ['--smart-case']
          : args.caseStrategy === 'sensitive'
            ? ['--case-sensitive']
            : []),
      ...globFlags,
      '--',
      shellEscape(args.pattern),
      ...targetPaths,
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
        return { output: '', metadata: { info: 'No matches found.', exitCode: 1, command: cmd } };
      }
      return {
        output: `Error executing rg: ${err.message}`,
        metadata: { exitCode: err.code ?? -1, command: cmd, stderr: err.stderr },
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
