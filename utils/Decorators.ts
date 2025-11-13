import test from '@playwright/test';

/**
 * Creates a decorator that wraps an async function call inside a Playwright-style `test.step`
 * while formatting a BDD-style step name from the function arguments.
 *
 * The returned decorator replaces the provided async function with an async wrapper that:
 * - Builds a step title by replacing placeholders in `pattern` of the form `{0}`, `{1}`, ... with
 *   the JSON.stringify representation of the corresponding argument.
 * - Leaves a placeholder unchanged if the corresponding argument is `undefined`.
 * - Executes the original function inside `test.step(formattedName, async () => ...)` and returns
 *   the resolved value from the original function call.
 *
 * Generics preserve the original `this` type, parameter tuple, and resolved return type.
 *
 * @template This - The `this` context type for the decorated function.
 * @template Args - Tuple type describing the original function's parameters.
 * @template Return - The resolved value type of the original function's returned Promise.
 *
 * @param pattern - A string pattern for the step name. Use placeholders like `{0}`, `{1}`, ...
 *                  to inject serialized argument values into the step name.
 * @returns A decorator function which accepts the original async function and returns a replacement
 *          async function that runs the original implementation inside `test.step` and returns a
 *          `Promise<Return>`.
 *
 *
 * @remarks
 * - This helper expects a `test` object with a `step(name, fn)` API (for example Playwright Test).
 * - The wrapper preserves `this` binding and forwards all arguments to the original function.
 */
function pwTestStep(pattern?: string) {
  return function decorator<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Promise<Return>
    >
  ) {
    async function replacementMethod(
      this: This,
      ...args: Args
    ): Promise<Return> {
      let testName = '';
      if (pattern) {
        const formattedName = pattern.replace(/{(\d+)}/g, (match, index) => {
          const paramIndex = parseInt(index, 10);
          return args[paramIndex] !== undefined
            ? JSON.stringify(args[paramIndex])
            : match;
        });
        testName = formattedName;
      } else {
        const uncamel = (s: string) => {
          const spaced = s
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // fooBar -> foo Bar
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // XMLHttp -> XML Http
            .replace(/[_\-\s]+/g, ' ') // snake_case or kebab-case -> spaces
            .trim();
          return spaced.length
            ? spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
            : spaced;
        };

        const rawName = context?.name?.toString() ?? '';
        testName = uncamel(rawName);
      }

      return test.step(testName, async () => target.call(this, ...args));
    }
    return replacementMethod;
  };
}

export function given(pattern: string) {
  return pwTestStep(`GIVEN ${pattern}`);
}

export function when(pattern: string) {
  return pwTestStep(`WHEN ${pattern}`);
}

export function then(pattern: string) {
  return pwTestStep(`THEN ${pattern}`);
}

export function and(pattern: string) {
  return pwTestStep(`AND ${pattern}`);
}

export function step(pattern?: string) {
  return pwTestStep(pattern);
}
