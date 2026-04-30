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
    "Read file contents with optional line ranges. Highly recommended for inspecting code with line numbers.",
  args: {
    filepath: tool.schema.string().describe("The path to the file to read."),
    lineRange: tool.schema
      .string()
      .optional()
      .describe("Specify range (e.g., '30:40', '40:', or '30:+10')."),
    language: tool.schema
      .string()
      .optional()
      .describe("Explicitly set the language for syntax detection."),
    showAll: tool.schema
      .boolean()
      .optional()
      .describe("Show non-printable characters like tabs or newlines (-A)."),
    diff: tool.schema
      .boolean()
      .optional()
      .describe("Only show lines that have been modified with respect to Git index."),
    highlightLine: tool.schema
      .string()
      .optional()
      .describe("Highlight the specified line ranges (--highlight-line)."),
    fileName: tool.schema
      .string()
      .optional()
      .describe("Specify the name to display for the file (--file-name)."),
    plain: tool.schema
      .boolean()
      .optional()
      .describe("Only show plain style, no decorations (-p)."),
    listLanguages: tool.schema
      .boolean()
      .optional()
      .describe("List all supported languages (--list-languages)."),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const { filepath, lineRange, language, showAll, diff, highlightLine, fileName, plain, listLanguages } = args;

    const flags: string[] = ["--style=numbers", "--color=never", "--paging=never"];

    if (lineRange) flags.push(`--line-range ${lineRange}`);
    if (language) flags.push(`--language ${language}`);
    if (showAll) flags.push("--show-all");
    if (diff) flags.push("--diff");
    if (highlightLine) flags.push(`--highlight-line ${highlightLine}`);
    if (fileName) flags.push(`--file-name ${shellEscape(fileName)}`);
    if (plain) flags.push("--plain");
    if (listLanguages) {
      const command = `bat --list-languages`;
      const { stdout, stderr } = await execAsync(command, {
        cwd: directory || worktree,
        signal: abort,
      });
      return {
        output: stdout,
        metadata: { stderr: stderr || undefined, command, directory },
      };
    }

    const command = `bat ${flags.join(" ")} ${shellEscape(filepath)}`;

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: directory || worktree,
        signal: abort,
      });

      return {
        output: stdout,
        metadata: {
          stderr: stderr || undefined,
          command,
          filepath,
        },
      };
    } catch (err: unknown) {
      const error = err as ExecError;

      return {
        output: `Error reading file with bat: ${error.message}`,
        metadata: {
          exitCode: error.code ?? -1,
          stderr: error.stderr,
          command,
        },
      };
    }
  },
});
