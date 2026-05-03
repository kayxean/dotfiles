import { tool } from '@opencode-ai/plugin';
import { stream } from '../lib/stream';

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
  execute(args, context) {
    const { directory, worktree } = context;
    const { manager, command, args: commandArgs = [], cwd } = args;
    const managerToUse = manager ?? 'vp';

    return stream(
      () =>
        Promise.resolve({
          cmd: managerToUse,
          flags: [command, ...commandArgs],
          cwd: cwd ?? directory ?? worktree,
          // 5 min timeout for long-running commands (build, test)
          timeout: 5 * 60 * 1000,
        }),
      [args, context],
    );
  },
});
