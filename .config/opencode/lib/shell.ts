import type { ChildProcess, ExecOptions, PromiseWithChild } from 'node:child_process';
import { exec } from 'node:child_process';

interface ExtendedExecOptions extends ExecOptions {
  timeout?: number;
}

export const execAsync = (
  command: string,
  options: ExtendedExecOptions,
): PromiseWithChild<{
  readonly stdout: string;
  readonly stderr: string;
}> => {
  let child!: ChildProcess;
  let timeoutId: NodeJS.Timeout;

  const promise = new Promise<{
    readonly stdout: string;
    readonly stderr: string;
  }>((resolve, reject) => {
    child = exec(command, { ...options, encoding: 'utf8' }, (error, stdout, stderr) => {
      if (timeoutId) clearTimeout(timeoutId);

      if (error) {
        const isKilled = child.killed || error.signal === 'SIGTERM';
        const execError = Object.assign(error, {
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          message: isKilled ? `Command timed out after ${options.timeout}ms` : error.message,
        });
        reject(execError);
        return;
      }

      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      } as const);
    });

    if (options.timeout && options.timeout > 0) {
      timeoutId = setTimeout(() => {
        if (child) {
          child.kill('SIGTERM');
        }
      }, options.timeout);
    }
  });

  return Object.assign(promise, { child });
};

export function shellEscape(arg: string): string {
  if (/^[a-zA-Z0-9_\-./:@]+$/.test(arg)) {
    return arg;
  }

  return `'${arg.replaceAll("'", "'\\''")}'`;
}
