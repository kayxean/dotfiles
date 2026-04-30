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
    "A fast and user-friendly alternative to 'find'. Use this to locate files or directories by name or pattern.",
  args: {
    pattern: tool.schema
      .string()
      .optional()
      .describe("The search pattern (regex by default, or glob if specified)."),
    path: tool.schema
      .string()
      .optional()
      .describe("The root directory for the search. Defaults to current directory."),
    hidden: tool.schema.boolean().optional().describe("Include hidden files and directories (-H)."),
    noIgnore: tool.schema
      .boolean()
      .optional()
      .describe("Show results from files ignored by .gitignore etc. (-I)."),
    glob: tool.schema
      .boolean()
      .optional()
      .describe("Perform a glob-based search instead of regex (-g)."),
    fixedStrings: tool.schema
      .boolean()
      .optional()
      .describe("Treat the pattern as a literal string (-F)."),
    absolutePath: tool.schema
      .boolean()
      .optional()
      .describe("Show absolute paths instead of relative ones (-a)."),
    maxDepth: tool.schema.number().optional().describe("Limit directory traversal depth (-d)."),
    extension: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Filter by file extension(s) (-e)."),
    fileType: tool.schema
      .enum(["f", "file", "d", "dir", "l", "symlink", "x", "executable", "e", "empty"])
      .optional()
      .describe("Filter by file type (-t)."),
    exclude: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Exclude files/directories matching glob (-E)."),
    noIgnoreVcs: tool.schema
      .boolean()
      .optional()
      .describe("Show results ignored by .gitignore (--no-ignore-vcs)."),
    noRequireGit: tool.schema
      .boolean()
      .optional()
      .describe("Do not require a git repo for gitignore rules (--no-require-git)."),
    noIgnoreParent: tool.schema
      .boolean()
      .optional()
      .describe("Show results ignored by parent .gitignore (--no-ignore-parent)."),
    caseSensitive: tool.schema.boolean().optional().describe("Perform case-sensitive search (-s)."),
    ignoreCase: tool.schema.boolean().optional().describe("Perform case-insensitive search (-i)."),
    regex: tool.schema.boolean().optional().describe("Use regex search instead of glob (--regex)."),
    and: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Additional required search patterns (--and)."),
    listDetails: tool.schema.boolean().optional().describe("Use detailed listing format (-l)."),
    ignoreFile: tool.schema
      .string()
      .optional()
      .describe("Add a file of ignore rules (--ignore-file)."),
    prune: tool.schema
      .boolean()
      .optional()
      .describe("Do not traverse into matching directories (--prune)."),
    maxResults: tool.schema
      .number()
      .optional()
      .describe("Limit number of search results (--max-results)."),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const {
      pattern,
      path,
      hidden,
      noIgnore,
      glob,
      fixedStrings,
      absolutePath,
      maxDepth,
      extension,
      fileType,
      exclude,
      noIgnoreVcs,
      noRequireGit,
      noIgnoreParent,
      caseSensitive,
      ignoreCase,
      regex,
      and,
      listDetails,
      ignoreFile,
      prune,
      maxResults,
    } = args;

    const flags: string[] = ["--color=never"];

    if (hidden) flags.push("-H");
    if (noIgnore) flags.push("-I");
    if (noIgnoreVcs) flags.push("--no-ignore-vcs");
    if (noRequireGit) flags.push("--no-require-git");
    if (noIgnoreParent) flags.push("--no-ignore-parent");
    if (glob) flags.push("-g");
    if (fixedStrings) flags.push("-F");
    if (caseSensitive) flags.push("-s");
    if (ignoreCase) flags.push("-i");
    if (regex) flags.push("--regex");
    if (absolutePath) flags.push("-a");
    if (maxDepth !== undefined) flags.push(`--max-depth ${maxDepth}`);
    if (fileType) flags.push(`--type ${fileType}`);
    if (listDetails) flags.push("-l");
    if (ignoreFile) flags.push(`--ignore-file ${shellEscape(ignoreFile)}`);
    if (prune) flags.push("--prune");
    if (maxResults !== undefined) flags.push(`--max-results ${maxResults}`);

    if (extension) {
      extension.forEach((ext) => flags.push(`-e ${shellEscape(ext)}`));
    }

    if (exclude) {
      exclude.forEach((pattern) => flags.push(`-E ${shellEscape(pattern)}`));
    }

    if (and) {
      and.forEach((pattern) => flags.push(`--and ${shellEscape(pattern)}`));
    }

    const cmdParts = ["fd", ...flags];
    if (path) cmdParts.push(`--search-path ${shellEscape(path)}`);
    if (pattern) cmdParts.push(shellEscape(pattern));

    const command = cmdParts.join(" ");

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

      if (error.code === 1 || error.code === "1") {
        return {
          output: "",
          metadata: {
            info: "No files found matching the criteria.",
            exitCode: 1,
            command,
          },
        };
      }

      return {
        output: `Error executing fd: ${error.message}`,
        metadata: {
          exitCode: error.code ?? -1,
          stderr: error.stderr,
          command,
        },
      };
    }
  },
});
