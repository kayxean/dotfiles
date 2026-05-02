import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

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
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const cwd = directory || worktree;

    const excludeFlags = (args.exclude ?? []).map((e) => `--exclude ${shellEscape(e)}`);
    const inputPaths = (args.inputs ?? []).map((path) => shellEscape(path));

    const cmd = [
      'tokei',
      ...excludeFlags,
      ...(args.files ? ['--files'] : []),
      ...(args.hidden ? ['--hidden'] : []),
      ...(args.noIgnore ? ['--no-ignore'] : []),
      ...(args.output ? [`--output ${shellEscape(args.output)}`] : []),
      ...(args.sort ? [`--sort ${args.sort}`] : []),
      ...(args.types ? [`--types ${shellEscape(args.types.join(','))}`] : []),
      ...(args.compact ? ['--compact'] : []),
      ...inputPaths,
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
        output: `Error executing tokei: ${err.message}`,
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
