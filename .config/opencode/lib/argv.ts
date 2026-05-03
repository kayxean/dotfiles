type FlagValue = string | number | boolean | string[] | null | undefined;
type FlagStyle = 'equals' | 'space' | 'repeat' | 'comma' | 'value-as-flag';

interface FlagMapping {
  flag: string;
  style?: FlagStyle;
}

type FlagsMapping<T> = {
  [K in keyof T]?: string | FlagMapping;
};

/**
 * Options for building a CLI argument vector.
 */
interface ArgvOptions<T extends Record<string, FlagValue>> {
  /**
   * Always-included flags prepended before mapped and positional args.
   * Use for constants that apply regardless of user input.
   *
   * @example
   * ['--color=never', '--no-heading']
   */
  fixed?: string[];

  /**
   * Map of arg key → CLI flag descriptor.
   * Controls how each value is serialized into flag strings.
   *
   * Styles:
   * - `equals`        (default) `--flag=value`
   * - `space`                   `--flag value`
   * - `repeat`                  `--flag=a --flag=b`  (arrays only)
   * - `comma`                   `--flag=a,b,c`       (arrays joined)
   * - `value-as-flag`           `--{value}`          (value becomes the flag name)
   *
   * @example
   * {
   *   hidden:    '--hidden',
   *   maxDepth:  '--max-depth',
   *   extension: { flag: '--extension', style: 'repeat' },
   *   types:     { flag: '--types',     style: 'comma' },
   *   action:    { flag: '',            style: 'value-as-flag' },
   * }
   */
  mapping: FlagsMapping<T>;

  /**
   * Ordered positional args appended after mapped flags.
   * Accepts raw strings, derived values, or literal separators like `'--'`.
   * Falsy values (`undefined`, `null`, `false`, `''`) are skipped automatically.
   *
   * @example
   * [args.command, '--', args.pattern, ...args.paths]
   */
  positional?: FlagValue[];
}

// --- internal helpers ---

function assertSafeFlag(v: string): void {
  if (!/^[a-z0-9-]+$/i.test(v)) {
    throw new Error(`Security Error: Invalid flag name detected: "${v}"`);
  }
}

function resolveDescriptor(descriptor: string | FlagMapping): Required<FlagMapping> {
  return typeof descriptor === 'string'
    ? { flag: descriptor, style: 'equals' }
    : { style: 'equals', ...descriptor };
}

// --- export ---

/**
 * Transforms a typed args object into a CLI-compatible argument vector.
 * Serves as the bridge between structured tool arguments and the raw string
 * array consumed by the process in `stream()`.
 *
 * Output order: `fixed` → mapped flags → `positional`
 *
 * @example
 * argv(args, {
 *   fixed: ['--color=never'],
 *   mapping: {
 *     hidden:    '--hidden',
 *     maxDepth:  '--max-depth',
 *     extension: { flag: '--extension', style: 'repeat' },
 *   },
 *   positional: [args.pattern, searchPath],
 * })
 */
export function argv<T extends Record<string, FlagValue>>(
  args: T,
  options: ArgvOptions<T>,
): string[] {
  const { fixed = [], mapping, positional = [] } = options;

  // Pre-allocate with fixed args to reduce resizes
  const result: string[] = [...fixed];

  for (const key of Object.keys(mapping) as (keyof T & string)[]) {
    const descriptor = mapping[key];
    if (descriptor === undefined) continue;

    const value = args[key];
    // Skip falsy values except 0 and true
    if (value === undefined || value === null || value === false || value === '') continue;

    const { flag, style } = resolveDescriptor(descriptor);

    if (value === true) {
      result.push(flag);
      continue;
    }

    const values = Array.isArray(value) ? value.map(String) : [String(value)];

    for (const v of values) {
      if (style === 'value-as-flag') {
        // Shield against injection
        assertSafeFlag(v);
        result.push(`--${v}`);
      } else if (style === 'space') {
        result.push(flag, v);
      } else if (style === 'comma') {
        // Join the full array into one token — break after first push to avoid duplicates
        result.push(`${flag}=${values.join(',')}`);
        break;
      } else {
        // default: 'equals' or 'repeat'
        result.push(`${flag}=${v}`);
      }
    }
  }

  // Handle positional arguments
  for (const v of positional) {
    if (v !== undefined && v !== null && v !== false && v !== '') {
      result.push(String(v));
    }
  }

  return result;
}
