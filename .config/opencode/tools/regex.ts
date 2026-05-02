import type { CommandResult } from '../lib/types';
import { tool } from '@opencode-ai/plugin';
import { execAsync, shellEscape } from '../lib/shell';

export default tool({
  description:
    'Generate a regular expression from concrete example strings using grex. Provide every string the regex must match; grex produces the tightest pattern that covers all of them. Use this when you know what the input looks like but not how to express it as a pattern.',
  args: {
    inputs: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe(
        'Example strings the generated regex must match. Provide as many as needed to represent all valid inputs. Pass ["-"] to read examples from stdin instead.',
      ),
    file: tool.schema
      .string()
      .optional()
      .describe(
        'Path to a file containing example strings, one per line. Alternative to passing inputs directly.',
      ),
    digits: tool.schema
      .boolean()
      .optional()
      .describe('Replace Unicode decimal digit characters with the \\d shorthand class.'),
    nonDigits: tool.schema
      .boolean()
      .optional()
      .describe('Replace non-digit characters with the \\D shorthand class.'),
    spaces: tool.schema
      .boolean()
      .optional()
      .describe('Replace Unicode whitespace characters with the \\s shorthand class.'),
    nonSpaces: tool.schema
      .boolean()
      .optional()
      .describe('Replace non-whitespace characters with the \\S shorthand class.'),
    words: tool.schema
      .boolean()
      .optional()
      .describe('Replace Unicode word characters with the \\w shorthand class.'),
    nonWords: tool.schema
      .boolean()
      .optional()
      .describe('Replace non-word characters with the \\W shorthand class.'),
    escape: tool.schema
      .boolean()
      .optional()
      .describe('Represent non-ASCII characters as Unicode escape sequences (\\uXXXX).'),
    repetitions: tool.schema
      .boolean()
      .optional()
      .describe(
        'Detect repeated substrings and express them with {min,max} quantifiers instead of listing each repetition explicitly.',
      ),
    minRepetitions: tool.schema
      .number()
      .optional()
      .describe(
        'Minimum number of repetitions before grex uses a quantifier. Defaults to 1. Increase to allow short runs to remain literal.',
      ),
    minSubstringLength: tool.schema
      .number()
      .optional()
      .describe(
        'Minimum character length of a substring before it is considered for repetition detection. Prevents single-character repetitions from being quantified.',
      ),
    noAnchors: tool.schema
      .boolean()
      .optional()
      .describe(
        'Remove the ^ and $ anchors from the generated pattern. Use when the regex will be embedded inside a larger expression.',
      ),
    ignoreCase: tool.schema
      .boolean()
      .optional()
      .describe('Generate a case-insensitive pattern (adds the (?i) flag or folds cases).'),
    captureGroups: tool.schema
      .boolean()
      .optional()
      .describe(
        'Use capturing groups () instead of non-capturing groups (?:). Use when you need to extract submatches from the result.',
      ),
    verbose: tool.schema
      .boolean()
      .optional()
      .describe(
        'Produce a verbose-mode regex with whitespace and comments for readability. Compatible with the (?x) flag.',
      ),
  },
  async execute(args, context) {
    const { directory, worktree, abort } = context;
    const cwd = directory || worktree;

    const inputCases = (args.inputs ?? []).map((input) => shellEscape(input));

    const cmd = [
      'grex',
      ...(args.file ? ['--file', shellEscape(args.file)] : []),
      ...(args.digits ? ['--digits'] : []),
      ...(args.nonDigits ? ['--non-digits'] : []),
      ...(args.spaces ? ['--spaces'] : []),
      ...(args.nonSpaces ? ['--non-spaces'] : []),
      ...(args.words ? ['--words'] : []),
      ...(args.nonWords ? ['--non-words'] : []),
      ...(args.escape ? ['--escape'] : []),
      ...(args.repetitions ? ['--repetitions'] : []),
      ...(args.minRepetitions ? [`--min-repetitions ${args.minRepetitions}`] : []),
      ...(args.minSubstringLength ? [`--min-substring-length ${args.minSubstringLength}`] : []),
      ...(args.noAnchors ? ['--no-anchors'] : []),
      ...(args.ignoreCase ? ['--ignore-case'] : []),
      ...(args.captureGroups ? ['--capture-groups'] : []),
      ...(args.verbose ? ['--verbose'] : []),
      ...inputCases,
    ].join(' ');

    const result: CommandResult = await execAsync(cmd, {
      cwd,
      signal: abort,
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024,
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
        output: `Error executing grex: ${err.message}`,
        metadata: {
          exitCode: err.code ?? -1,
          stderr: err.stderr,
          command: cmd,
        },
      };
    }

    return {
      output: result.stdout,
      metadata: {
        stderr: result.stderr || undefined,
        command: cmd,
      },
    };
  },
});
