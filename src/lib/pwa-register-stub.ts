// Stub for vite-plugin-pwa's virtual module. The original app used PWA
// service-worker registration; this no-op keeps the imported code running
// unchanged inside the TanStack Start build.
export function registerSW(_options?: unknown): (reloadPage?: boolean) => Promise<void> {
  return async () => {};
}
