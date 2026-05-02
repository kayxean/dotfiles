export type CommandResult =
  | { readonly success: true; readonly stdout: string; readonly stderr: string }
  | {
      readonly success: false;
      readonly error: Error & { code?: number | string; stderr?: string };
    };
