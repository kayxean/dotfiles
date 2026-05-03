import { tool } from '@opencode-ai/plugin';
import { argv } from '../lib/argv';
import { stream } from '../lib/stream';

export default tool({
  description:
    'Extract fields and values from structured data files (JSON, YAML, TOML, CBOR, MessagePack) using jg. Use this when you need a specific value from a config or data file instead of reading the whole thing with view.',
  args: {
    query: tool.schema
      .string()
      .describe(
        'jg query expression. "**.name" walks the full tree and returns every "name" field. "dependencies.react" accesses a nested key directly. Use fixedString: true to treat this as a literal key name instead of an expression.',
      ),
    filepath: tool.schema
      .string()
      .optional()
      .describe(
        'Path to the structured file to query. When omitted, jg reads from stdin — pipe content in via the shell if needed.',
      ),
    format: tool.schema
      .enum(['auto', 'json', 'jsonl', 'yaml', 'toml', 'cbor', 'msgpack'])
      .optional()
      .describe(
        'Force a specific input format. Defaults to "auto" (detected from file extension or content). Set explicitly if the file extension is misleading or absent.',
      ),
    ignoreCase: tool.schema
      .boolean()
      .optional()
      .describe('Match field names case-insensitively. Useful for inconsistently cased keys.'),
    compact: tool.schema
      .boolean()
      .optional()
      .describe('Output compact single-line JSON instead of pretty-printed multi-line JSON.'),
    count: tool.schema
      .boolean()
      .optional()
      .describe(
        'Return the number of matches instead of the matched values. Use to check how many occurrences exist.',
      ),
    fixedString: tool.schema
      .boolean()
      .optional()
      .describe(
        'Treat query as a literal field name and search for it at any depth in the document. Use when the key name contains characters that would otherwise be interpreted as jg syntax.',
      ),
    noPath: tool.schema
      .boolean()
      .optional()
      .describe(
        'Suppress the path header above each result. Cleaner output when you only care about the value, not where it came from.',
      ),
  },
  execute(args, context) {
    return stream(
      () =>
        Promise.resolve({
          cmd: 'jg',
          flags: argv(args, {
            fixed: ['--porcelain'],
            mapping: {
              format: '--format',
              ignoreCase: '--ignore-case',
              compact: '--compact',
              count: '--count',
              fixedString: '--fixed-string',
              noPath: '--no-path',
            },
            positional: [args.query, args.filepath],
          }),
          cwd: context.directory || context.worktree,
        }),
      [args, context],
    );
  },
});
