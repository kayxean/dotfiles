import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

export default tool({
  description:
    'Read a local file with line numbers and syntax highlighting using bat. Use this instead of cat or head for any file inspection. For web content, use fetch instead.',
  args: {
    filepath: tool.schema.string().describe('Path to the file to read.'),
    lineRange: tool.schema
      .string()
      .optional()
      .describe(
        'Restrict output to a range of lines. Formats: "30:40" (lines 30–40), "40:" (line 40 to end), "30:+10" (10 lines starting at 30). Use this to zoom in on a specific section without reading the whole file.',
      ),
    language: tool.schema
      .string()
      .optional()
      .describe(
        'Override the syntax highlighting language. Useful when the file extension is missing or misleading (e.g., a ".conf" file that contains TOML).',
      ),
    showAll: tool.schema
      .boolean()
      .optional()
      .describe(
        'Render non-printable characters visibly — tabs as arrows, newlines as symbols. Use when debugging whitespace or encoding issues.',
      ),
    diff: tool.schema
      .boolean()
      .optional()
      .describe(
        'Show only lines that differ from the Git index (staged or unstaged). Useful for reviewing exactly what you changed without opening a full diff.',
      ),
    diffContext: tool.schema
      .number()
      .optional()
      .describe(
        'Number of unchanged lines to show around each changed block when diff: true is set. Defaults to 2.',
      ),
    highlightLine: tool.schema
      .string()
      .optional()
      .describe(
        'Visually emphasize a range of lines. Same format as lineRange. Use to draw attention to specific lines in the output.',
      ),
    fileName: tool.schema
      .string()
      .optional()
      .describe(
        'Override the filename displayed in the header. Also controls syntax detection when reading from stdin or a pipe.',
      ),
    plain: tool.schema
      .boolean()
      .optional()
      .describe(
        'Strip all decorations (line numbers, borders, headers) and emit raw text only. Use when the output will be processed by another tool.',
      ),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const cwd = directory || worktree;

    const cmd = [
      'bat',
      '--style=numbers',
      '--color=never',
      '--paging=never',
      ...(args.lineRange ? [`--line-range ${shellEscape(args.lineRange)}`] : []),
      ...(args.language ? [`--language ${shellEscape(args.language)}`] : []),
      ...(args.showAll ? ['--show-all'] : []),
      ...(args.diff ? ['--diff'] : []),
      ...(args.diffContext ? [`--diff-context ${args.diffContext}`] : []),
      ...(args.highlightLine ? [`--highlight-line ${shellEscape(args.highlightLine)}`] : []),
      ...(args.fileName ? [`--file-name ${shellEscape(args.fileName)}`] : []),
      ...(args.plain ? ['--plain'] : []),
      shellEscape(args.filepath),
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
        output: `Error executing bat: ${err.message}`,
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
        filepath: args.filepath,
      },
    };
  },
});
