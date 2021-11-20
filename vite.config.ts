/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { dirname, relative } from 'path';

import preact from '@preact/preset-vite';
import { visualizer } from 'rollup-plugin-visualizer';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
// import copy from 'rollup-plugin-copy';

import { isDev, port, r } from './scripts/utils';

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      'src/': `${r('src')}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    // ! preact https://github.com/preactjs/preset-vite
    preact(),
    // ! rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`.replace(/\\/g, '/'), // ! replace backslash to slash
        );
      },
    },
  ],
  optimizeDeps: {
    include: ['preact', 'webextension-polyfill'],
  },
};

export default defineConfig(({ command }) => {
  return {
    ...sharedConfig,
    base: command === 'serve' ? `http://localhost:${port}/` : undefined,
    server: {
      port,
      hmr: {
        host: 'localhost',
      },
    },
    build: {
      outDir: r('extension/dist'),
      emptyOutDir: false,
      sourcemap: isDev ? 'inline' : false,
      terserOptions: {
        mangle: false,
      },
      cssCodeSplit: false, // ! If false, all CSS in the entire project will be extracted into a single CSS file.
      minify: 'terser',
      brotliSize: false, // ! compression size report
      rollupOptions: {
        input: {
          app: r('src/views/app/index.html'),
          popup: r('src/views/popup/index.html'),
          // background: r('src/views/background/index.html'),
          // options: r('src/views/options/index.html'),
          // newTab: r('src/views/new-tab/index.html'),
        },
        output: {
          manualChunks: {
            // ! manually bundle @mui for Popup to reduce size
            'mui-for-popup': [
              '@mui/material/Checkbox',
              '@mui/material/Rating',
              '@mui/material/Box',
              '@mui/material/Button',
              '@mui/material/CssBaseline',
              '@mui/material/Alert',
              '@mui/material/AlertTitle',
              '@mui/material/AppBar',
              '@mui/material/Button',
              '@mui/material/Toolbar',
              '@mui/material/Typography',
              '@mui/material/CircularProgress',
            ],
          },
        },
        plugins: [
          visualizer({
            filename: 'build/stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ],
      },
    },
    plugins: [...sharedConfig.plugins!],
  };
});

// copy({
//   targets: [
//     {
//       src: ['./node_modules/@mozilla/readability'],
//       dest: './extension/dist/',
//     },
//   ],
//   verbose: true,
//   copyOnce: true,
//   hook: 'writeBundle',
// }),
