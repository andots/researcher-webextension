import browser from 'webextension-polyfill';

export const getExtensionId = (): string => {
  return browser.runtime.id;
};

export const getExtensionAppUrl = (): string => {
  return browser.runtime.getURL('dist/views/app/index.html');
};

export const getAppTab = async (): Promise<browser.Tabs.Tab | undefined> => {
  const url = getExtensionAppUrl();
  const tabs = await browser.tabs.query({ url });
  if (tabs.length > 0) {
    return tabs[0];
  }
  return undefined;
};

export const getActiveTab = async (): Promise<browser.Tabs.Tab> => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
};

export const openApp = (): void => {
  browser.runtime.openOptionsPage();
};
