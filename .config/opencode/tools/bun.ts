import { tool } from "@opencode-ai/plugin";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

interface ExecError extends Error {
  code?: number | string;
  stdout?: string;
  stderr?: string;
}

function shellEscape(arg: string): string {
  if (/^[a-zA-Z0-9_\-./:@]+$/.test(arg)) return arg;
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

export default tool({
  description:
    "Execute Bun commands for high-performance JavaScript runtime tasks, package management, testing, and bundling.",
  args: {
    command: tool.schema
      .enum([
        "run",
        "test",
        "x",
        "repl",
        "exec",
        "install",
        "i",
        "add",
        "a",
        "remove",
        "rm",
        "update",
        "audit",
        "outdated",
        "link",
        "unlink",
        "publish",
        "patch",
        "pm",
        "info",
        "why",
        "build",
        "init",
        "create",
        "upgrade",
        "feedback",
      ])
      .describe("The Bun subcommand to execute."),
    args: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Arguments or flags (e.g., ['--watch'], ['--filter', 'pkg-a'], ['@types/node'])."),
    cwd: tool.schema
      .string()
      .optional()
      .describe("Directory to execute the command in. Defaults to current directory."),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const { command, args: commandArgs = [], cwd } = args;

    const fullCommand = `bun ${command} ${commandArgs.map(shellEscape).join(" ")}`;

    try {
      const { stdout, stderr } = await execAsync(fullCommand, {
        cwd: cwd || directory || worktree,
        signal: abort,
        env: { ...process.env, CI: "true", FORCE_COLOR: "0" },
      });

      return {
        output: stdout || "Command executed successfully.",
        metadata: {
          stderr: stderr || undefined,
          command: fullCommand,
          directory: cwd || directory,
        },
      };
    } catch (err: unknown) {
      const error = err as ExecError;

      return {
        output: `bun error: ${error.message}`,
        metadata: {
          exitCode: error.code ?? -1,
          stderr: error.stderr,
          stdout: error.stdout,
          command: fullCommand,
        },
      };
    }
  },
});
