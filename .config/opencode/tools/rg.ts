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
    "Recursively search the current directory for lines matching a regex pattern or literal string.",
  args: {
    pattern: tool.schema.string().describe("The regex or literal pattern to search for."),
    paths: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Files or directories to search. Defaults to current directory."),
    fixedStrings: tool.schema
      .boolean()
      .optional()
      .describe("Treat pattern as a literal string instead of a regex (-F)."),
    engine: tool.schema
      .enum(["default", "pcre2", "auto"])
      .optional()
      .describe("Specify the regex engine (--engine)."),
    caseStrategy: tool.schema
      .enum(["sensitive", "ignore", "smart"])
      .optional()
      .describe("Case sensitivity strategy: -s (default), -i, or -S."),
    globs: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Include/exclude files/directories using glob patterns (-g)."),
    hidden: tool.schema.boolean().optional().describe("Search hidden files and directories (-.)."),
    maxDepth: tool.schema.number().optional().describe("Limit directory traversal depth (-d)."),
    multiline: tool.schema
      .boolean()
      .optional()
      .describe("Enable searching across multiple lines (-U)."),
    context: tool.schema
      .number()
      .optional()
      .describe("Show NUM lines before and after matches (-C)."),
    maxCount: tool.schema
      .number()
      .optional()
      .describe("Limit the number of matching lines per file (-m)."),
    invertMatch: tool.schema.boolean().optional().describe("Print lines that do NOT match (-v)."),
    noIgnore: tool.schema
      .boolean()
      .optional()
      .describe("Search ignored files/directories (--no-ignore)."),
    typeList: tool.schema
      .boolean()
      .optional()
      .describe("Show all supported file types (--type-list)."),
    count: tool.schema
      .boolean()
      .optional()
      .describe("Only show count of matching lines per file (--count)."),
    filesWithMatches: tool.schema
      .boolean()
      .optional()
      .describe("Only show files containing matches (--files-with-matches)."),
    onlyMatching: tool.schema
      .boolean()
      .optional()
      .describe("Show only matching parts (--only-matching)."),
    replace: tool.schema
      .string()
      .optional()
      .describe("Replace matches with string (--replace)."),
    passthru: tool.schema
      .boolean()
      .optional()
      .describe("Print both matching and non-matching lines (--passthru)."),
    wordRegexp: tool.schema
      .boolean()
      .optional()
      .describe("Match full words only (-w)."),
    follow: tool.schema
      .boolean()
      .optional()
      .describe("Follow symbolic links (--follow)."),
    maxFilesize: tool.schema
      .string()
      .optional()
      .describe("Ignore files larger than size (--max-filesize)."),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;

    const {
      pattern,
      paths,
      fixedStrings,
      engine,
      caseStrategy,
      globs,
      hidden,
      maxDepth,
      multiline,
      context: ctx,
      maxCount,
      invertMatch,
      noIgnore,
      typeList,
      count,
      filesWithMatches,
      onlyMatching,
      replace,
      passthru,
      wordRegexp,
      follow,
      maxFilesize,
    } = args;

    const flags: string[] = [
      "--color=never",
      "--no-heading",
      "--with-filename",
      "--line-number",
      "--column",
    ];

    if (fixedStrings) flags.push("-F");
    if (engine) flags.push(`--engine=${engine}`);
    if (caseStrategy === "ignore") flags.push("-i");
    else if (caseStrategy === "smart") flags.push("-S");
    else if (caseStrategy === "sensitive") flags.push("-s");
    if (hidden) flags.push("-.");
    if (noIgnore) flags.push("--no-ignore");
    if (maxDepth !== undefined) flags.push(`--max-depth ${maxDepth}`);
    if (globs) globs.forEach((g) => flags.push(`-g ${shellEscape(g)}`));
    if (multiline) flags.push("-U");
    if (ctx !== undefined) flags.push(`-C ${ctx}`);
    if (maxCount !== undefined) flags.push(`-m ${maxCount}`);
    if (invertMatch) flags.push("-v");
    if (count) flags.push("--count");
    if (filesWithMatches) flags.push("--files-with-matches");
    if (onlyMatching) flags.push("--only-matching");
    if (replace) flags.push(`--replace ${shellEscape(replace)}`);
    if (passthru) flags.push("--passthru");
    if (wordRegexp) flags.push("-w");
    if (follow) flags.push("--follow");
    if (maxFilesize) flags.push(`--max-filesize ${shellEscape(maxFilesize)}`);

    if (typeList) {
      const command = `rg --type-list`;
      const { stdout, stderr } = await execAsync(command, {
        cwd: directory || worktree,
        signal: abort,
      });
      return {
        output: stdout,
        metadata: { stderr: stderr || undefined, command, directory },
      };
    }

    const targetPaths = paths?.length ? paths.map(shellEscape).join(" ") : ".";
    const command = `rg ${flags.join(" ")} -- ${shellEscape(pattern)} ${targetPaths}`;

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
          directory,
        },
      };
    } catch (err: unknown) {
      const error = err as ExecError;

      if (error.code === 1 || error.code === "1") {
        return {
          output: "",
          metadata: {
            info: "No matches found.",
            exitCode: 1,
            command,
          },
        };
      }

      return {
        output: `Error executing ripgrep: ${error.message}`,
        metadata: {
          exitCode: error.code ?? -1,
          command,
          stderr: error.stderr,
        },
      };
    }
  },
});
