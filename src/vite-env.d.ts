/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ROOT_DOMAIN: string;
  readonly VITE_API_PROTOCOL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
