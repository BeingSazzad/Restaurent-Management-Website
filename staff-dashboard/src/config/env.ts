import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().default('https://api.amberspice.ie/v1'),
  VITE_APP_NAME: z.string().default('Amber Spice Staff KDS'),
  VITE_ENVIRONMENT: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL || 'https://api.amberspice.ie/v1',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Amber Spice Staff KDS',
  VITE_ENVIRONMENT: import.meta.env.MODE || 'development',
});
