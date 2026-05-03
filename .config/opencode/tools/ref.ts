import { tool } from '@opencode-ai/plugin';
import { argv } from '../lib/argv';
import { stream } from '../lib/stream';

export default tool({
  description:
    'Search and replace text patterns across files using srgn. Supports regex with capture groups, literal string mode, and optional language-aware scoping (e.g., only inside functions or comments). Always previews as a diff first — set dryRun: false only when you are ready to write.',
  args: {
    scope: tool.schema
      .string()
      .describe(
        'Regex pattern (or literal string if literal: true) that identifies the text to act on. Example: "console\\.log\\((.+?)\\)" captures a log call. Matched text is either replaced by replacement or transformed by action.',
      ),
    replacement: tool.schema
      .string()
      .optional()
      .describe(
        'String to substitute for each match. Supports capture group references: $1, $2, etc. Omit when using action instead.',
      ),
    glob: tool.schema
      .string()
      .describe(
        'File glob pattern controlling which files are processed. Example: "src/**/*.ts" targets all TypeScript files under src. Keep this as narrow as possible to avoid timeouts.',
      ),
    dryRun: tool.schema
      .boolean()
      .default(true)
      .describe(
        'Preview changes as a diff without writing to disk. Defaults to true — always confirm the diff looks correct before setting false.',
      ),
    language: tool.schema
      .enum(['typescript', 'python', 'rust', 'go', 'c', 'csharp'])
      .optional()
      .describe(
        'Enable syntax-aware scoping for the given language. When set, pair with langScope to restrict matches to a specific syntactic region.',
      ),
    langScope: tool.schema
      .string()
      .optional()
      .describe(
        'Syntactic region to restrict matching to, within the chosen language. Examples: "function", "comments", "strings". Requires language to be set.',
      ),
    literal: tool.schema
      .boolean()
      .optional()
      .describe(
        'Interpret scope as a plain string — no regex. Use when the target text contains dots, brackets, or other metacharacters that would need escaping.',
      ),
    action: tool.schema
      .enum(['upper', 'lower', 'titlecase', 'delete', 'squeeze'])
      .optional()
      .describe(
        'Built-in transformation to apply to matched text instead of a replacement string. "upper"/"lower"/"titlecase" change case, "delete" removes matches, "squeeze" collapses repeated matches into one.',
      ),
  },
  execute(args, context) {
    return stream(
      () =>
        Promise.resolve({
          cmd: 'srgn',
          flags: argv(args, {
            mapping: {
              dryRun: '--dry-run',
              literal: '--literal-string',
              action: { flag: '', style: 'value-as-flag' },
              glob: { flag: '--glob', style: 'space' },
            },
            positional: [
              args.language && args.langScope ? `--${args.language}` : undefined,
              args.language && args.langScope ? args.langScope : undefined,
              args.scope,
              args.replacement ? '--' : undefined,
              args.replacement,
            ],
          }),
          cwd: context.directory || context.worktree,
          env: { ...process.env, FORCE_COLOR: '0' },
        }),
      [args, context],
    );
  },
});
