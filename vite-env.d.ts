// /// <reference types="vite/client" />
// The above reference is commented out because the type definition file is missing in this environment.
// Manual type declarations are provided below to ensure the app compiles.

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;
  export default src;
}

declare module '*.jpg';
declare module '*.png';
declare module '*.json';

// Shim for import.meta.env
interface ImportMetaEnv {
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
