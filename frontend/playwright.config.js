import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL;
if (!baseURL) throw new Error('E2E_BASE_URL is required');

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL,
    httpCredentials: {
      username: process.env.E2E_BASIC_USER || 'personal',
      password: process.env.E2E_BASIC_PASSWORD || '',
    },
  },
});
