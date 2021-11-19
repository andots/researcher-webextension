// import type { ProtocolWithReturn } from 'webext-bridge';

import type { Bookmark } from 'src/types';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    // 'tab-prev': { title: string | undefined };
    // 'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title: string }>;
    create: Bookmark;
    update: Bookmark;
  }
}
