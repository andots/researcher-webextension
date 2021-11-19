/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineConfig } from 'vite';

import { r, isDev } from './scripts/utils';
import { sharedConfig } from './vite.config';

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev
      ? {
          include: [r('src/webext/**/*'), r('src/components/**/*')],
        }
      : undefined,
    outDir: r('extension/dist'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: r('src/webext/content_scripts.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'content_scripts.global.js',
      },
    },
  },
  plugins: [...sharedConfig.plugins!],
});
