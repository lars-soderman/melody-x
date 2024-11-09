import { defineConfig } from '@playwright/test';

const config = defineConfig({
  testDir: './src/test/e2e',
  globalSetup: require.resolve('./src/test/e2e/setup/global-setup'),
  use: {
    baseURL: 'http://localhost:4000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  timeout: 5000,
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
  },
});

export default config;
