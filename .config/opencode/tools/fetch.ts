import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

export default tool({
  description:
    'Retrieve content from an HTTP or HTTPS URL using fetchkit. Returns structured JSON containing content, metadata, and frontmatter. Converts HTML to clean Markdown on request. Use this for documentation pages, API responses, changelogs, or any web resource.',
  args: {
    url: tool.schema.string().describe('The full HTTP or HTTPS URL to fetch.'),
    method: tool.schema
      .enum(['GET', 'HEAD'])
      .optional()
      .describe(
        'HTTP method. Defaults to GET. Use HEAD to inspect status and headers without downloading the body.',
      ),
    asMarkdown: tool.schema
      .boolean()
      .optional()
      .describe(
        'Convert the HTML response to Markdown with YAML frontmatter. Best for documentation pages you intend to read or summarize.',
      ),
    asText: tool.schema
      .boolean()
      .optional()
      .describe('Return the raw response body as plain text, wrapped in a JSON metadata envelope.'),
    saveToFile: tool.schema
      .string()
      .optional()
      .describe(
        'Local path to write the fetched content. Required for binary downloads (images, archives). Optional for text — use when you need the file on disk for a subsequent tool.',
      ),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const cwd = directory || worktree;

    const cmdParts = [
      'fetchkit',
      'fetch',
      ...(args.method ? [`--method ${shellEscape(args.method)}`] : []),
      ...(args.asMarkdown ? ['--output', 'md'] : []),
      ...(args.asText ? ['--output', 'json'] : []),
      shellEscape(args.url),
    ];

    const cmd = args.saveToFile
      ? [...cmdParts, '>', shellEscape(args.saveToFile)].join(' ')
      : cmdParts.join(' ');

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
        output: `Error executing fetchkit: ${err.message}`,
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
        url: args.url,
      },
    };
  },
});
