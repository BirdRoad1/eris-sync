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
  JWT_ECDSA_PRIVATE_KEY: z.string().transform(s => Buffer.from(s, 'base64').toString('utf-8')),
  JWT_ECDSA_PUBLIC_KEY: z.string().transform(s => Buffer.from(s, 'base64').toString('utf-8'))
});
