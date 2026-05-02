import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

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
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const cwd = directory || worktree;

    const cmd = [
      'difft',
      '--color=never',
      `--display=${args.display ?? 'side-by-side'}`,
      `--context=${args.context ?? 3}`,
      ...(args.ignoreComments ? ['--ignore-comments'] : []),
      ...(args.skipUnchanged ? ['--skip-unchanged'] : []),
      ...(args.checkOnly ? ['--check-only'] : []),
      shellEscape(args.oldPath),
      shellEscape(args.newPath),
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
      return {
        output: `Error executing difft: ${err.message}`,
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
      },
    };
  },
});
