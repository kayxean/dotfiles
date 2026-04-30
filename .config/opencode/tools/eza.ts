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
    "A modern replacement for ls. Use this to list files and directories with icons, git status, and extended metadata.",
  args: {
    path: tool.schema
      .string()
      .optional()
      .describe("The directory or file to list. Defaults to current directory."),
    all: tool.schema.boolean().optional().describe("Show hidden and 'dot' files (-a)."),
    long: tool.schema
      .boolean()
      .optional()
      .describe("Display extended file metadata as a table (-l)."),
    tree: tool.schema.boolean().optional().describe("Recurse into directories as a tree (-T)."),
    icons: tool.schema.boolean().optional().describe("Display icons (--icons)."),
    git: tool.schema
      .boolean()
      .optional()
      .describe("List each file's Git status, if tracked (--git)."),
    sort: tool.schema
      .enum([
        "name",
        "Name",
        "extension",
        "Extension",
        "size",
        "type",
        "modified",
        "accessed",
        "created",
        "inode",
        "none",
      ])
      .optional()
      .describe("Which field to sort by (-s)."),
    reverse: tool.schema.boolean().optional().describe("Reverse the sort order (-r)."),
    groupDirsFirst: tool.schema
      .boolean()
      .optional()
      .describe("List directories before other files (--group-directories-first)."),
    level: tool.schema.number().optional().describe("Limit the depth of recursion (-L)."),
    ignoreGlob: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Glob patterns of files to ignore (-I)."),
    gitIgnore: tool.schema
      .boolean()
      .optional()
      .describe("Ignore files mentioned in '.gitignore' (--git-ignore)."),
    oneline: tool.schema.boolean().optional().describe("Display one entry per line (-1)."),
    classify: tool.schema
      .boolean()
      .optional()
      .describe("Display type indicator by file names (-F)."),
    grid: tool.schema.boolean().optional().describe("Display entries as a grid (-G)."),
    across: tool.schema
      .boolean()
      .optional()
      .describe("Sort the grid across, rather than downwards (-x)."),
    recurse: tool.schema.boolean().optional().describe("Recurse into directories (-R)."),
    dereference: tool.schema.boolean().optional().describe("Dereference symbolic links (-X)."),
    colorScale: tool.schema
      .boolean()
      .optional()
      .describe("Highlight levels of 'field' distinctly (--color-scale)."),
    noQuotes: tool.schema
      .boolean()
      .optional()
      .describe("Don't quote file names with spaces (--no-quotes)."),
    hyperlink: tool.schema
      .boolean()
      .optional()
      .describe("Display entries as hyperlinks (--hyperlink)."),
    absolute: tool.schema
      .enum(["on", "follow", "off"])
      .optional()
      .describe("Display entries with absolute path (--absolute)."),
    followSymlinks: tool.schema
      .boolean()
      .optional()
      .describe("Drill down into symlinks (--follow-symlinks)."),
    onlyDirs: tool.schema.boolean().optional().describe("List only directories (-D)."),
    onlyFiles: tool.schema.boolean().optional().describe("List only files (-f)."),
    groupDirsLast: tool.schema
      .boolean()
      .optional()
      .describe("List directories after other files (--group-directories-last)."),
    header: tool.schema.boolean().optional().describe("Add a header row to each column (-h)."),
    inode: tool.schema.boolean().optional().describe("List each file's inode number (-i)."),
    links: tool.schema.boolean().optional().describe("List each file's number of hard links (-H)."),
    time: tool.schema
      .enum(["modified", "accessed", "created"])
      .optional()
      .describe("Which timestamp field to list (-t, -u, -U)."),
    octal: tool.schema.boolean().optional().describe("List permissions in octal format (-o)."),
    noPermissions: tool.schema
      .boolean()
      .optional()
      .describe("Suppress the permissions field (--no-permissions)."),
    noFilesize: tool.schema
      .boolean()
      .optional()
      .describe("Suppress the filesize field (--no-filesize)."),
    noUser: tool.schema.boolean().optional().describe("Suppress the user field (--no-user)."),
    noTime: tool.schema.boolean().optional().describe("Suppress the time field (--no-time)."),
    noGit: tool.schema.boolean().optional().describe("Suppress Git status (--no-git)."),
    extended: tool.schema.boolean().optional().describe("List extended attributes (-@)."),
    context: tool.schema.boolean().optional().describe("List security context (-Z)."),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const {
      path,
      all,
      long,
      tree,
      icons,
      git,
      sort,
      reverse,
      groupDirsFirst,
      level,
      ignoreGlob,
      gitIgnore,
      oneline,
      classify,
      grid,
      across,
      recurse,
      dereference,
      colorScale,
      noQuotes,
      hyperlink,
      absolute,
      followSymlinks,
      onlyDirs,
      onlyFiles,
      groupDirsLast,
      header,
      inode,
      links,
      time,
      octal,
      noPermissions,
      noFilesize,
      noUser,
      noTime,
      noGit,
      extended,
    } = args;

    const flags: string[] = ["--color=never"];

    if (all) flags.push("-a");
    if (long) flags.push("-l");
    if (tree) flags.push("-T");
    if (icons) flags.push("--icons");
    if (git) flags.push("--git");
    if (sort) flags.push(`-s ${sort}`);
    if (reverse) flags.push("-r");
    if (groupDirsFirst) flags.push("--group-directories-first");
    if (level !== undefined) flags.push(`-L ${level}`);
    if (ignoreGlob) {
      ignoreGlob.forEach((glob) => flags.push(`-I ${shellEscape(glob)}`));
    }
    if (gitIgnore) flags.push("--git-ignore");
    if (oneline) flags.push("-1");
    if (classify) flags.push("-F");
    if (grid) flags.push("-G");
    if (across) flags.push("-x");
    if (recurse) flags.push("-R");
    if (dereference) flags.push("-X");
    if (colorScale) flags.push("--color-scale");
    if (noQuotes) flags.push("--no-quotes");
    if (hyperlink) flags.push("--hyperlink");
    if (absolute) flags.push(`--absolute ${absolute}`);
    if (followSymlinks) flags.push("--follow-symlinks");
    if (onlyDirs) flags.push("-D");
    if (onlyFiles) flags.push("-f");
    if (groupDirsLast) flags.push("--group-directories-last");
    if (header) flags.push("-h");
    if (inode) flags.push("-i");
    if (links) flags.push("-H");
    if (time) flags.push(`-t ${time}`);
    if (octal) flags.push("-o");
    if (noPermissions) flags.push("--no-permissions");
    if (noFilesize) flags.push("--no-filesize");
    if (noUser) flags.push("--no-user");
    if (noTime) flags.push("--no-time");
    if (noGit) flags.push("--no-git");
    if (extended) flags.push("-@");

    const targetPath = path ? shellEscape(path) : ".";
    const command = `eza ${flags.join(" ")} ${targetPath}`;

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
        output: `Error executing eza: ${error.message}`,
        metadata: {
          exitCode: error.code ?? -1,
          stderr: error.stderr,
          command,
        },
      };
    }
  },
});
