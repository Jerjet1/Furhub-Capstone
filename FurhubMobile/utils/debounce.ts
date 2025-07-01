export function debouncePromise<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  let pendingPromise: Promise<any> | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (timeoutId) clearTimeout(timeoutId);

    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        pendingPromise = fn(...args).then(resolve);
      }, delay);
    });
  };
}
