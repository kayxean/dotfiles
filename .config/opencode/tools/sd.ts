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
    "Search and replace in file(s). Modifies files in-place by default. Use for refactoring and bulk text changes.",
  args: {
    find: tool.schema.string().describe("The regexp or string to search for."),
    replace: tool.schema
      .string()
      .describe("The replacement string (supports $1, $2 for regex groups)."),
    files: tool.schema.array(tool.schema.string()).describe("List of file paths to modify."),
    preview: tool.schema
      .boolean()
      .optional()
      .describe("Display changes in a reviewable format instead of applying them (-p)."),
    fixedStrings: tool.schema
      .boolean()
      .optional()
      .describe("Treat FIND and REPLACE as literal strings (-F)."),
    flags: tool.schema
      .string()
      .optional()
      .describe(
        "Regex flags: c (sensitive), i (insensitive), m (multi-line), w (full words), etc.",
      ),
    across: tool.schema
      .boolean()
      .optional()
      .describe(
        "Process file as a whole instead of line-by-line (allows cross-line matches) (-A).",
      ),
    maxReplacements: tool.schema.number().optional().describe("Limit replacements per file (-n)."),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const { find, replace, files, preview, fixedStrings, flags, across, maxReplacements } = args;

    const options: string[] = [];

    if (preview) options.push("-p");
    if (fixedStrings) options.push("-F");
    if (flags) options.push(`-f ${shellEscape(flags)}`);
    if (across) options.push("-A");
    if (maxReplacements !== undefined) options.push(`-n ${maxReplacements}`);

    const fileList = files.map((f) => shellEscape(f)).join(" ");

    const command = `sd ${options.join(" ")} ${shellEscape(find)} ${shellEscape(replace)} ${fileList}`;

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: directory || worktree,
        signal: abort,
      });

      return {
        output: preview ? stdout : `Successfully updated ${files.length} file(s).`,
        metadata: {
          stderr: stderr || undefined,
          command,
          applied: !preview,
        },
      };
    } catch (err: unknown) {
      const error = err as ExecError;

      return {
        output: `Error executing sd: ${error.message}`,
        metadata: {
          exitCode: error.code ?? -1,
          stderr: error.stderr,
          command,
        },
      };
    }
  },
});
