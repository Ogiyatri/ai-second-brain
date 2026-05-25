/**
 * Utility to handle async/await without try-catch.
 * Usage: const [err, data] = await to(promise)
 */
export async function to<T>(
  promise: Promise<T>,
): Promise<[Error | null, T | null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err as Error, null];
  }
}
