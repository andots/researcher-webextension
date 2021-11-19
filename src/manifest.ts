import type { Manifest } from 'webextension-polyfill';
import pkg from '../package.json';
import { isDev, port } from '../scripts/utils';

export async function getManifest(): Promise<Manifest.WebExtensionManifest> {
  return {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: {
        16: './public/icon-16.png',
        32: './public/icon-32.png',
        48: './public/icon-48.png',
        96: './public/icon-96.png',
        128: './public/icon-128.png',
        512: './public/icon-512.png',
      },
      default_popup: './dist/views/popup/index.html',
    },
    options_ui: {
      page: './dist/views/app/index.html',
      open_in_tab: true,
      chrome_style: false,
    },
    content_scripts: [
      {
        matches: ['http://*/*', 'https://*/*'],
        js: ['./dist/content_scripts.global.js'],
      },
    ],
    icons: {
      16: './public/icon-16.png',
      32: './public/icon-32.png',
      48: './public/icon-48.png',
      96: './public/icon-96.png',
      128: './public/icon-128.png',
      512: './public/icon-512.png',
    },
    permissions: [
      'tabs',
      'activeTab',
      'storage',
      'bookmarks',
      'http://*/*',
      'https://*/*',
    ],
    // ! new tab
    // chrome_url_overrides: {
    //   newtab: './dist/new-tab/index.html',
    // },
    // ! background
    // background: {
    // page: './dist/views/background/index.html',
    // scripts: ['./dist/background.global.js'],
    // persistent: true, // ! false gives firefox warning (not supported)
    // },
    // this is required on dev for Vite script to load
    content_security_policy: isDev
      ? `script-src \'self\' http://localhost:${port}; object-src \'self\'`
      : undefined,
  };
}
