import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

export default tool({
  description:
    'Run package manager commands — install dependencies, execute scripts, build, test, lint, and manage packages. Uses vp (Vite+) by default; supports bun. Never use npm, npx, yarn, or pnpm directly.',
  args: {
    manager: tool.schema
      .enum(['vp', 'bun'])
      .optional()
      .default('vp')
      .describe(
        'Package manager to use. Default is "vp" (Vite+). Use "bun" only when the project explicitly requires it.',
      ),
    command: tool.schema
      .enum([
        // Core Logic
        'run',
        'test',
        'exec',
        'install',
        'add',
        'remove',
        'update',
        'outdated',
        'link',
        'unlink',
        'pm',
        'info',
        'why',
        'build',
        'create',
        'upgrade',

        // Vite+ Specific
        'migrate',
        'config',
        'staged',
        'env',
        'dev',
        'check',
        'lint',
        'fmt',
        'node',
        'dlx',
        'cache',
        'pack',
        'preview',
        'rebuild',

        // Bun Specific
        'x',
        'repl',
        'audit',
        'patch',
        'init',
        'feedback',
      ])
      .describe(
        'Subcommand to execute. Common choices: "check" (fmt + lint + typecheck in one shot, use before every commit), "test" (run the test suite), "build" (compile for production), "add" / "remove" (manage packages), "run" + args (execute a package.json script).',
      ),
    args: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Extra flags and positional arguments appended after the subcommand. Examples: ["--watch"] for test, ["my-script"] for run, ["lodash"] for add.',
      ),
    cwd: tool.schema
      .string()
      .optional()
      .describe(
        'Directory to run the command in. Defaults to the project root. Set this when working inside a monorepo workspace package.',
      ),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const { manager, command, args: commandArgs = [], cwd } = args;
    const managerToUse = manager ?? 'vp';

    const optionalFlags = commandArgs.map((arg: string) => shellEscape(arg));

    const cmd = [managerToUse, command, ...optionalFlags].join(' ');

    const result: CommandResult = await execAsync(cmd, {
      cwd: cwd ?? directory ?? worktree,
      signal: abort,
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, CI: 'true', FORCE_COLOR: '0' },
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
        output: `Error executing ${managerToUse}: ${err.message}`,
        metadata: {
          exitCode: err.code ?? -1,
          stderr: err.stderr,
          command: cmd,
          manager: managerToUse,
        },
      };
    }

    return {
      output: result.stdout,
      metadata: {
        stderr: result.stderr || undefined,
        command: cmd,
        directory: cwd ?? directory ?? worktree,
        manager: managerToUse,
      },
    };
  },
});
