import { chromium } from '@playwright/test';

export async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Add crypto and localStorage polyfills
  await context.addInitScript(() => {
    window.crypto = {
      ...window.crypto,
      randomUUID: (): `${string}-${string}-${string}-${string}-${string}` => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }) as `${string}-${string}-${string}-${string}-${string}`;
      },
    };

    // Initialize localStorage if it doesn't exist
    if (!window.localStorage) {
      let storage: Record<string, string> = {};
      window.localStorage = {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => {
          storage[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete storage[key];
        },
        clear: () => {
          storage = {};
        },
        key: (i: number) => Object.keys(storage)[i] || null,
        length: 0,
      };
      Object.defineProperty(window.localStorage, 'length', {
        get: () => Object.keys(storage).length,
      });
    }
  });

  await browser.close();
}
export default globalSetup;
