import z from 'zod';

export const envSchema = z.object({
  PORT: z
    .string()
    .default('8000')
    .transform(z => Number(z))
    .refine(n => n >= 0 && n <= 65535, { error: 'Invalid port number' }),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string(),
  ADMIN_TOKEN: z.string().nonempty(),
  JWT_PRIVATE_KEY: z.string(),
  USER_TOKEN: z.string()
});
