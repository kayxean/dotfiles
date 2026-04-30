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
    "Process JSON files or strings using jq filters. Ideal for extracting data from package.json or config files.",
  args: {
    filter: tool.schema
      .string()
      .describe("The jq filter to apply (e.g., '.scripts' or '.[0].name')."),
    filepath: tool.schema.string().describe("The path to the JSON file to process."),
    compact: tool.schema
      .boolean()
      .optional()
      .describe("Compact instead of pretty-printed output (-c)."),
    rawOutput: tool.schema
      .boolean()
      .optional()
      .describe("Output strings without escapes and quotes (-r)."),
    slurp: tool.schema.boolean().optional().describe("Read all inputs into an array (-s)."),
    sortKeys: tool.schema.boolean().optional().describe("Sort keys of each object on output (-S)."),
    rawInput: tool.schema
      .boolean()
      .optional()
      .describe("Read each line as a string instead of JSON (-R)."),
    nullInput: tool.schema
      .boolean()
      .optional()
      .describe("Use `null` as the single input value (-n)."),
    rawOutput0: tool.schema
      .boolean()
      .optional()
      .describe("Implies -r and output NUL after each output."),
    joinOutput: tool.schema
      .boolean()
      .optional()
      .describe("Implies -r and output without newline (-j)."),
    asciiOutput: tool.schema
      .boolean()
      .optional()
      .describe("Output strings by only ASCII characters (-a)."),
    colorOutput: tool.schema
      .boolean()
      .optional()
      .describe("Colorize JSON output (-C)."),
    tab: tool.schema
      .boolean()
      .optional()
      .describe("Use tabs for indentation (--tab)."),
    indent: tool.schema
      .number()
      .optional()
      .describe("Use N spaces for indentation (--indent N)."),
    unbufferd: tool.schema
      .boolean()
      .optional()
      .describe("Flush output stream after each output (--unbuffered)."),
    stream: tool.schema
      .boolean()
      .optional()
      .describe("Parse the input value in streaming fashion (--stream)."),
    arg: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Set jq variables (--arg name value)."),
    argjson: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Set jq variables as JSON (--argjson name value)."),
    rawfile: tool.schema
      .string()
      .optional()
      .describe("Read input from file (--rawfile)."),
    seq: tool.schema
      .boolean()
      .optional()
      .describe("Use seq encoding (--seq)."),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const {
      filter,
      filepath,
      compact,
      rawOutput,
      slurp,
      sortKeys,
      rawInput,
      nullInput,
      rawOutput0,
      joinOutput,
      asciiOutput,
      colorOutput,
      tab,
      indent,
      unbufferd,
      stream,
      arg,
      argjson,
      rawfile,
      seq,
    } = args;

    const flags: string[] = ["--monochrome-output"];

    if (compact) flags.push("-c");
    if (rawOutput) flags.push("-r");
    if (slurp) flags.push("-s");
    if (sortKeys) flags.push("-S");
    if (rawInput) flags.push("-R");
    if (nullInput) flags.push("-n");
    if (rawOutput0) flags.push("--raw-output0");
    if (joinOutput) flags.push("-j");
    if (asciiOutput) flags.push("-a");
    if (colorOutput) flags.push("-C");
    if (tab) flags.push("--tab");
    if (indent !== undefined) flags.push(`--indent ${indent}`);
    if (unbufferd) flags.push("--unbuffered");
    if (stream) flags.push("--stream");
    if (arg) {
      arg.forEach((a) => flags.push(`--arg ${shellEscape(a)}`));
    }
    if (argjson) {
      argjson.forEach((a) => flags.push(`--argjson ${shellEscape(a)}`));
    }
    if (rawfile) flags.push(`--rawfile ${shellEscape(rawfile)}`);
    if (seq) flags.push("--seq");

    const command = `jq ${flags.join(" ")} ${shellEscape(filter)} ${shellEscape(filepath)}`;

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: directory || worktree,
        signal: abort,
      });

      return {
        output: stdout.trim(),
        metadata: {
          stderr: stderr || undefined,
          command,
          directory,
        },
      };
    } catch (err: unknown) {
      const error = err as ExecError;

      return {
        output: `Error executing jq: ${error.message}`,
        metadata: {
          exitCode: error.code ?? -1,
          stderr: error.stderr,
          command,
        },
      };
    }
  },
});
