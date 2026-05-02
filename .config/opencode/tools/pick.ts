import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

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
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const cwd = directory || worktree;

    const cmd = [
      'jg',
      '--porcelain',
      ...(args.format ? [`--format ${args.format}`] : []),
      ...(args.ignoreCase ? ['--ignore-case'] : []),
      ...(args.compact ? ['--compact'] : []),
      ...(args.count ? ['--count'] : []),
      ...(args.fixedString ? ['--fixed-string'] : []),
      ...(args.noPath ? ['--no-path'] : []),
      shellEscape(args.query),
      ...(args.filepath ? [shellEscape(args.filepath)] : []),
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
      const err = result.error;
      return {
        output: `Error executing jg: ${err.message}`,
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
        format: args.format,
      },
    };
  },
});
