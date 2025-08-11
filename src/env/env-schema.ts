import path from 'path';
import z from 'zod';
import fs from 'fs';

export const envSchema = z.object({
  BASE_URL: z.string(),
  PORT: z
    .string()
    .default('8000')
    .transform(z => Number(z))
    .refine(n => n >= 0 && n <= 65535, { error: 'Invalid port number' }),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string(),
  ADMIN_TOKEN: z.string().nonempty(),
  JWT_ECDSA_PRIVATE_KEY: z
    .string()
    .transform(s => Buffer.from(s, 'base64').toString('utf-8')),
  JWT_ECDSA_PUBLIC_KEY: z
    .string()
    .transform(s => Buffer.from(s, 'base64').toString('utf-8')),
  STORAGE_PATH: z
    .string()
    .transform(s => path.resolve(s))
    .refine(s => fs.existsSync(s) && fs.statSync(s).isDirectory(), {
      error: 'STORAGE_PATH directory does not exist!'
    })
});
