import { tool } from '@opencode-ai/plugin';
import { argv } from '../lib/argv';
import { stream } from '../lib/stream';

export default tool({
  description:
    'Compare two files or directories using syntax-aware structural diffing (difft). Parses the AST so cosmetic changes — whitespace, indentation, formatting — are invisible noise. Only semantically meaningful changes appear. Supports side-by-side, inline, and JSON output.',
  args: {
    oldPath: tool.schema
      .string()
      .describe('Path to the original file or directory (the "before").'),
    newPath: tool.schema
      .string()
      .describe('Path to the new file or directory to compare against (the "after").'),
    display: tool.schema
      .enum(['side-by-side', 'side-by-side-show-both', 'inline', 'json'])
      .default('side-by-side')
      .describe(
        'Output format. "side-by-side" is best for human review. "json" is machine-readable but requires DFT_UNSTABLE=yes in the environment.',
      ),
    context: tool.schema
      .number()
      .default(3)
      .describe(
        'Number of unchanged lines to show around each change. Increase for more surrounding context.',
      ),
    ignoreComments: tool.schema
      .boolean()
      .optional()
      .describe('Strip comments before diffing — useful when only logic changes matter.'),
    skipUnchanged: tool.schema
      .boolean()
      .optional()
      .describe(
        'Omit files with no changes from the output. Essential when diffing a directory — otherwise identical files flood the output.',
      ),
    checkOnly: tool.schema
      .boolean()
      .optional()
      .describe(
        'Exit non-zero if any difference exists, without computing or printing the full diff. Fast CI guard.',
      ),
  },
  execute(args, context) {
    return stream(
      () =>
        Promise.resolve({
          cmd: 'difft',
          flags: argv(args, {
            fixed: [
              '--color=never',
              `--display=${args.display ?? 'side-by-side'}`,
              `--context=${args.context ?? 3}`,
            ],
            mapping: {
              ignoreComments: '--ignore-comments',
              skipUnchanged: '--skip-unchanged',
              checkOnly: '--check-only',
            },
            positional: [args.oldPath, args.newPath],
          }),
          cwd: context.directory || context.worktree,
        }),
      [args, context],
    );
  },
});
