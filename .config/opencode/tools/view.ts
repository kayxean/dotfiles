import { tool } from '@opencode-ai/plugin';
import { argv } from '../lib/argv';
import { stream } from '../lib/stream';

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
  execute(args, context) {
    return stream(
      () =>
        Promise.resolve({
          cmd: 'bat',
          flags: argv(args, {
            fixed: ['--style=numbers', '--color=never', '--paging=never'],
            mapping: {
              lineRange: '--line-range',
              language: '--language',
              showAll: '--show-all',
              diff: '--diff',
              diffContext: '--diff-context',
              highlightLine: '--highlight-line',
              fileName: '--file-name',
              plain: '--plain',
            },
            positional: [args.filepath],
          }),
          cwd: context.directory || context.worktree,
        }),
      [args, context],
    );
  },
});
