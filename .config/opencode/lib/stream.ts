import type { ToolContext, ToolResult } from '@opencode-ai/plugin';
import type { ExecFileException, ExecFileOptionsWithStringEncoding } from 'node:child_process';
import { execFile } from 'node:child_process';
import { z } from 'zod';

/**
 * Exit code interpretation strategy for a tool.
 * Allows tools to define which exit codes should be treated as success.
 *
 * Examples:
 * - ripgrep: { 0: 'success', 1: 'success' }  // 0 = found, 1 = no matches
 * - jq: { 0: 'success', 5: 'error' }  // 5 = invalid JSON
 */
type ExitCodeMap = Record<number | string, 'success' | 'error'>;

type DiagnosticMetadata = {
  success: boolean;
  exitCode: number | string | undefined;
  stderr?: string;
  stdout?: string;
  command: string;
  isTimeout: boolean;
  isBufferOverflow: boolean;
  isAborted: boolean;
  signal?: string;
};

interface StreamOptions extends ExecFileOptionsWithStringEncoding {
  cmd: string;
  flags: string[];
  /**
   * Map exit codes to success/error semantics.
   * Allows tools to define tool-specific exit code meanings.
   *
   * @example
   * { 0: 'success', 1: 'success' }  // ripgrep: 0=found, 1=no matches
   * @default { 0: 'success' }
   */
  exitCodeMap?: ExitCodeMap;

  /**
   * Maximum buffer size before truncation. Defaults to 10MB
   * Set higher for tools that generate large output (e.g., trace.ts, stats.ts).
   * @default 10485760
   */
  maxBuffer?: number;

  /**
   * Timeout in milliseconds. Defaults to 1 minute.
   * Set for tools that may hang or run indefinitely.
   * @default 60000
   */
  timeout?: number;

  /**
   * If true, preserve trailing whitespace in stdout/stderr.
   * Defaults to false (trim whitespace).
   * @default false
   */
  preserveWhitespace?: boolean;

  /**
   * Custom formatter for success output.
   * If provided, overrides default output formatting.
   * Receives (stdout, exitCode, stderr) tuple.
   */
  formatSuccess?: (stdout: string, exitCode: number | string, stderr: string) => string;

  /**
   * Custom formatter for error output.
   * If provided, overrides default error message formatting.
   * Receives (stderr, exitCode, error message) tuple.
   */
  formatError?: (
    stderr: string,
    exitCode: number | string | undefined,
    errorMessage: string,
  ) => string;
}

/**
 * Interprets whether an exit code should be treated as success or error.
 * Falls back to standard semantics (0 = success, non-zero = error) if not in map.
 */
function interpretExitCode(
  code: number | string | undefined,
  exitCodeMap?: ExitCodeMap,
): 'success' | 'error' {
  if (code === undefined) return 'error';

  // Check tool-specific mapping first
  if (exitCodeMap && code in exitCodeMap) {
    return exitCodeMap[code];
  }

  // Standard Unix semantics: 0 = success, anything else = error
  return code === 0 ? 'success' : 'error';
}

/**
 * Detects if a process was killed by a signal (e.g., SIGTERM, SIGSEGV).
 * Returns the signal name or undefined if killed by exit code.
 */
function extractSignal(error: ExecFileException): string | undefined {
  // error.signal contains the signal name if process was killed
  return error.signal;
}

/**
 * Detects if output was truncated due to buffer overflow.
 * Returns true if stdout/stderr hit the maxBuffer limit.
 */
function isBufferOverflow(error: ExecFileException): boolean {
  // Node.js sets error.code to 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' when buffer limit hit
  return error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER';
}

/**
 * Build diagnostic metadata with complete information about execution.
 */
function buildDiagnostics(
  cmd: string,
  flags: string[],
  exitCode: number | string | undefined,
  stdout: string,
  stderr: string,
  error: ExecFileException | null,
  isAborted: boolean,
  exitCodeMap?: ExitCodeMap,
): DiagnosticMetadata {
  return {
    success: interpretExitCode(exitCode, exitCodeMap) === 'success',
    exitCode,
    stderr: stderr || undefined,
    stdout: stdout || undefined,
    command: `${cmd} ${flags.join(' ')}`,
    isTimeout: error?.code === 'ETIMEDOUT',
    isBufferOverflow: error ? isBufferOverflow(error) : false,
    isAborted,
    signal: error ? extractSignal(error) : undefined,
  };
}

export async function stream<Options extends z.ZodRawShape>(
  fn: (args: z.infer<z.ZodObject<Options>>) => Promise<StreamOptions>,
  [args, ctx]: [z.infer<z.ZodObject<Options>>, ToolContext],
): Promise<ToolResult> {
  const opt = await fn(args);

  return new Promise<ToolResult>((resolve) => {
    execFile(
      opt.cmd,
      opt.flags,
      {
        cwd: opt.cwd ?? ctx.directory,
        signal: ctx.abort,
        encoding: opt.encoding ?? 'utf-8',
        env: opt.env,
        uid: opt.uid,
        gid: opt.gid,
        windowsHide: opt.windowsHide,
        maxBuffer: opt.maxBuffer ?? 10485760,
        timeout: opt.timeout ?? 60000,
      },
      (error: ExecFileException | null, stdout: string, stderr: string) => {
        const isAborted = ctx.abort.aborted || error?.name === 'AbortError';
        const shouldPreserveWhitespace = opt.preserveWhitespace ?? false;
        const out = shouldPreserveWhitespace ? stdout : stdout.trim();
        const err = shouldPreserveWhitespace ? stderr : stderr.trim();

        // error.code is typed `string | number | null | undefined` — the merged
        // type of ExecException.code (number) and ErrnoException.code (string).
        // Numeric → process exit code. String → Node internal identifier
        // ('ETIMEDOUT', 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER', etc.) which must
        // never reach exitCodeMap lookups. No error → clean exit at 0.
        const exitCode: number | undefined = error
          ? typeof error.code === 'number'
            ? error.code
            : undefined
          : 0;

        // Interpret exit code with tool-specific semantics
        const interpretation = interpretExitCode(exitCode, opt.exitCodeMap);
        // Drop `&& !error`: when exitCodeMap marks a non-zero code as success
        // (e.g. rg/fd exit 1 = no matches), error is non-null but the result
        // is still valid. We check error conditions explicitly below instead.
        const isSuccess = interpretation === 'success';

        // Build rich diagnostic metadata
        const diagnostics = buildDiagnostics(
          opt.cmd,
          opt.flags,
          exitCode,
          out,
          err,
          error ?? null,
          isAborted,
          opt.exitCodeMap,
        );

        if (!isSuccess) {
          // Error case: abort, timeout, buffer overflow, or non-zero exit code
          const signal = error ? extractSignal(error) : undefined;
          const isTimeoutError = error?.code === 'ETIMEDOUT';
          const isBufferError = error ? isBufferOverflow(error) : false;

          let title = `Command Failed: ${opt.cmd}`;
          if (isAborted) {
            title = `Command Aborted: ${opt.cmd}`;
          } else if (isTimeoutError) {
            title = `Command Timeout: ${opt.cmd}`;
          } else if (isBufferError) {
            title = `Command Output Exceeded Buffer: ${opt.cmd}`;
          } else if (signal) {
            title = `Command Killed by Signal: ${opt.cmd} (${signal})`;
          }

          ctx.metadata({
            title,
            metadata: diagnostics,
          });

          // Use custom formatter if provided, otherwise default
          const errorMessage = opt.formatError
            ? opt.formatError(err, exitCode, error?.message ?? 'Unknown error')
            : (err ?? error?.message ?? 'Command failed with no output');

          return resolve({
            output: isAborted
              ? 'Process execution was cancelled.'
              : isTimeoutError
                ? `Command timeout after ${opt.timeout}ms`
                : isBufferError
                  ? `Output exceeded buffer limit (${opt.maxBuffer} bytes)`
                  : signal
                    ? `Process killed by signal: ${signal}`
                    : `Error: ${errorMessage}`,
            metadata: diagnostics,
          });
        }

        // Success case
        ctx.metadata({
          title: `Command Success: ${opt.cmd}`,
          metadata: diagnostics,
        });

        // Use custom formatter if provided, otherwise default
        const successOutput = opt.formatSuccess
          ? opt.formatSuccess(out, exitCode ?? 0, err)
          : out || 'Command executed successfully.';

        resolve({
          output: successOutput,
          metadata: diagnostics,
        });
      },
    );
  });
}
