import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'e2e.spec.ts',use:{baseURL:process.env.BASE_URL||'http://localhost:5173',headless:true},reporter:'list'});
