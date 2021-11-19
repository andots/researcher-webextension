import browser from 'webextension-polyfill';

export const getActiveTab = async (): Promise<browser.Tabs.Tab> => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
};

export const openApp = (): void => {
  browser.runtime.openOptionsPage();
};
