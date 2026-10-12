const cache = new Map<string, Promise<unknown>>();

/**
 * Dedupes a fetch by key so a resource kicked off early — e.g. by AdminShell right after
 * login, before the provider that owns it has even mounted — is reused instead of re-fetched
 * once that provider's own effect runs. Each admin provider nests inside the previous one and
 * only renders its children once its own data has loaded, so without this, their initial loads
 * run as a strict chain instead of in parallel (see AdminShell).
 */
export function preload<T>(key: string, fetcher: () => Promise<T>, force = false): Promise<T> {
  if (force) cache.delete(key);
  let p = cache.get(key) as Promise<T> | undefined;
  if (!p) {
    p = fetcher().catch((err) => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, p);
  }
  return p;
}
