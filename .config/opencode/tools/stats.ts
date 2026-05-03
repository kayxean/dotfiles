import { tool } from '@opencode-ai/plugin';
import { argv } from '../lib/argv';
import { stream } from '../lib/stream';

export default tool({
  description:
    'Count lines of code, comments, and blanks by language across a project using tokei. Use this for project scale analysis, language breakdowns, or understanding how much code exists before diving in.',
  args: {
    inputs: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Paths to analyze. Defaults to the current working directory. Pass multiple paths to aggregate statistics across several directories.',
      ),
    exclude: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Glob patterns for files or directories to exclude from the count. Example: ["vendor", "*.generated.ts"].',
      ),
    files: tool.schema
      .boolean()
      .optional()
      .describe(
        'Break down statistics per individual file instead of per-language totals. Produces verbose output in large projects.',
      ),
    hidden: tool.schema
      .boolean()
      .optional()
      .describe('Count files inside hidden directories (names starting with a dot).'),
    noIgnore: tool.schema
      .boolean()
      .optional()
      .describe('Count files that are excluded by .gitignore or .ignore rules.'),
    output: tool.schema
      .enum(['json', 'yaml', 'cbor'])
      .optional()
      .describe(
        'Machine-readable output format. Use "json" when you need to process the statistics programmatically.',
      ),
    sort: tool.schema
      .enum(['files', 'lines', 'blanks', 'code', 'comments'])
      .optional()
      .describe('Sort the output table by this column. Defaults to language name.'),
    types: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Restrict output to these language names. Case-sensitive. Example: ["TypeScript", "Python"]. Run without this filter first to see the exact names tokei uses.',
      ),
    compact: tool.schema
      .boolean()
      .optional()
      .describe(
        'Hide embedded language statistics (e.g., JS inside HTML). Produces a cleaner summary table.',
      ),
  },
  execute(args, context) {
    return stream(
      () =>
        Promise.resolve({
          cmd: 'tokei',
          flags: argv(args, {
            mapping: {
              files: '--files',
              hidden: '--hidden',
              noIgnore: '--no-ignore',
              output: '--output',
              sort: '--sort',
              compact: '--compact',
              exclude: { flag: '--exclude', style: 'repeat' },
              types: { flag: '--types', style: 'comma' },
            },
            positional: args.inputs ?? [],
          }),
          cwd: context.directory || context.worktree,
          exitCodeMap: { 0: 'success', 1: 'success' },
        }),
      [args, context],
    );
  },
});
