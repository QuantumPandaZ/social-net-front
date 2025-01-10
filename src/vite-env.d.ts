/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function registerSW(
    options?: RegisterSWOptions,
  ): (reloadPage?: boolean) => Promise<void>
}

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_PROD_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
