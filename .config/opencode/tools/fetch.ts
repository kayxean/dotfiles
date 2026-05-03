import { tool } from '@opencode-ai/plugin';
import { stream } from '../lib/stream';

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
  execute(args, context) {
    return stream(
      () =>
        Promise.resolve({
          cmd: 'fetchkit',
          flags: [
            'fetch',
            ...(args.method ? [`--method=${args.method}`] : []),
            ...(args.asMarkdown ? ['--output=md'] : []),
            ...(args.asText ? ['--output=json'] : []),
            ...(args.saveToFile ? [`--output-file=${args.saveToFile}`] : []),
            args.url,
          ],
          cwd: context.directory || context.worktree,
        }),
      [args, context],
    );
  },
});
