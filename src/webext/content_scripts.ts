import browser from 'webextension-polyfill';

import { GET_READABILITY_ARTICLE } from 'src/constants';

browser.runtime.onMessage.addListener((message) => {
  if (message === GET_READABILITY_ARTICLE) {
    return Promise.resolve(document.documentElement.innerHTML);
  }
  return Promise.reject();
});
