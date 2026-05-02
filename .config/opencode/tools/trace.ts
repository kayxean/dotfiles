import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

export default tool({
  description:
    'Search and rewrite code by AST structure using ast-grep. Matches code by shape and syntax, not by text — so the same pattern finds a function call regardless of spacing, line breaks, or variable names. Use this when text search would miss semantically equivalent code, or when you need structure-preserving rewrites.',
  args: {
    command: tool.schema
      .enum(['run', 'scan'])
      .describe(
        '"run" executes a single inline pattern against files — the fast path for targeted searches and rewrites. "scan" loads a YAML rule file for complex, multi-condition queries across an entire codebase.',
      ),
    pattern: tool.schema
      .string()
      .optional()
      .describe(
        'AST pattern to match. Use metavariables ($NAME) as wildcards that capture any node. Example: "console.log($MSG)" matches every console.log call regardless of what is passed. Required for "run"; omit for "scan".',
      ),
    rewrite: tool.schema
      .string()
      .optional()
      .describe(
        'Replacement pattern for matched nodes. Metavariables from pattern are available here. Example: if pattern is "console.log($MSG)", rewrite "logger.info($MSG)" replaces each call. Preview with json: true before applying.',
      ),
    lang: tool.schema
      .string()
      .optional()
      .describe(
        'Target language for AST parsing. Examples: "ts", "tsx", "js", "py", "go", "rs". Must be set explicitly — do not rely on file extension inference in mixed-language repos.',
      ),
    rule: tool.schema
      .string()
      .optional()
      .describe(
        'Path to a YAML rule file. Used with command: "scan" for multi-step or complex queries that cannot be expressed as a single pattern.',
      ),
    inlineRules: tool.schema
      .string()
      .optional()
      .describe(
        'YAML rule definition provided as a string directly in the call, instead of loading from a file. Alternative to rule when you want to avoid creating a temporary file.',
      ),
    json: tool.schema
      .boolean()
      .optional()
      .describe(
        'Return results as machine-readable JSON. Each match includes the file path, line range, and matched text. Use this to inspect results before committing to a rewrite.',
      ),
    debugQuery: tool.schema
      .enum(['cst', 'ast', 'pattern'])
      .optional()
      .describe(
        'Print the internal tree-sitter representation of the query for debugging. "cst" shows the concrete syntax tree, "ast" shows the abstract tree, "pattern" shows how the pattern is parsed. Requires lang to be set.',
      ),
    paths: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Specific files or directories to search. Defaults to the project root. Narrow this to reduce noise and speed up the scan.',
      ),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const cwd = directory || worktree;

    const cmdArgs: string[] = [
      'ast-grep',
      args.command,
      ...(args.pattern ? ['--pattern', shellEscape(args.pattern)] : []),
      ...(args.rewrite ? ['--rewrite', shellEscape(args.rewrite)] : []),
      ...(args.lang ? ['--lang', shellEscape(args.lang)] : []),
      ...(args.rule ? ['--rule', shellEscape(args.rule)] : []),
      ...(args.inlineRules ? ['--inline-rules', shellEscape(args.inlineRules)] : []),
      ...(args.json ? ['--json'] : []),
      ...(args.debugQuery ? [`--debug-query=${args.debugQuery}`] : []),
      ...(args.paths ?? []).map((path) => shellEscape(path)),
    ];

    const cmd = cmdArgs.join(' ');

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
      const err = result.error as Error & {
        code?: number | string;
        stdout?: string;
        stderr?: string;
      };
      if ((err.code === 1 || err.code === '1') && (!err.stdout || err.stdout.trim().length === 0)) {
        return {
          output: '',
          metadata: {
            stderr: err.stderr ?? undefined,
            command: cmd,
            commandUsed: args.command,
            note: 'No matches found (exit code 1 from ast-grep)',
          },
        };
      }
      return {
        output: `Error executing ast-grep: ${err.message}`,
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
        commandUsed: args.command,
      },
    };
  },
});
