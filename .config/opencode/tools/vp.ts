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
    "Vite+ CLI tool for project orchestration, environment management, and dependency control. Use this for building, testing, and managing the development lifecycle.",
  args: {
    command: tool.schema
      .enum([
        "create",
        "migrate",
        "config",
        "staged",
        "install",
        "i",
        "env",
        "dev",
        "check",
        "lint",
        "fmt",
        "test",
        "run",
        "exec",
        "node",
        "dlx",
        "cache",
        "build",
        "pack",
        "preview",
        "add",
        "remove",
        "rm",
        "un",
        "uninstall",
        "update",
        "up",
        "dedupe",
        "outdated",
        "list",
        "ls",
        "why",
        "explain",
        "info",
        "view",
        "show",
        "link",
        "ln",
        "unlink",
        "rebuild",
        "pm",
      ])
      .describe("The Vite+ subcommand to execute."),
    args: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Additional arguments or flags for the command."),
    cwd: tool.schema
      .string()
      .optional()
      .describe("The directory to run the command in. Useful for monorepo sub-packages."),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const { command, args: commandArgs = [], cwd } = args;

    const fullCommand = `vp ${command} ${commandArgs.map(shellEscape).join(" ")}`;

    try {
      const { stdout, stderr } = await execAsync(fullCommand, {
        cwd: cwd || directory || worktree,
        signal: abort,
        env: { ...process.env, CI: "true", FORCE_COLOR: "0" },
      });

      return {
        output: stdout || "Command completed successfully.",
        metadata: {
          stderr: stderr || undefined,
          command: fullCommand,
          directory: cwd || directory,
        },
      };
    } catch (err: unknown) {
      const error = err as ExecError;

      return {
        output: `vp error: ${error.message}`,
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
