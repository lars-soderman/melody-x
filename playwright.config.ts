import { defineConfig } from '@playwright/test';

const config = defineConfig({
  testDir: './e2e',
  globalSetup: require.resolve('./e2e/setup/global-setup'),
  use: {
    baseURL: 'http://localhost:4000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
  },
});

export default config;
