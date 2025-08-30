import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().optional(),
  JWT_SECRET: z.string().default('your-secret-key-here'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  BCRYPT_ROUNDS: z.coerce.number().int().positive().default(10),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/glass'),
});

export type Env = z.infer<typeof EnvSchema>;

export const getEnv = (): Env => {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Environment validation failed');
  }
  return parsed.data;
};
