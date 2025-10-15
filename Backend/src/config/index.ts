import { z } from 'zod/v4';

const envSchema = z.object({
  MONGO_URI: z.url({ protocol: /mongodb/ }),
  DB_NAME: z.string(),

  // BACKEND_USER_URL: z.url().default('http://localhost:8000'),
  REFRESH_TOKEN_TTL: z.coerce.number().default(30 * 24 * 60 * 60), // 30 days in seconds,
  ACCESS_TOKEN_TTL: z.coerce.number().default(15 * 60), // 15 minutes
  SALT_ROUNDS: z.coerce.number().default(13),

  ACCESS_JWT_SECRET: z
    .string({
      error: 'ACCESS_JWT_SECRET is required and must be at least 64 characters long'
    })
    .min(64),

  CLIENT_BASE_URL: z.url().default('http://localhost:5173'),
  AI_API_KEY: z.string(),
  AI_MODEL: z.string().default('gemini-2.0-flash'),
  AI_URL: z.string().default('https://generativelanguage.googleapis.com/v1beta/openai/')
});

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error(`\x1b[31mInvalid environment variables:\n', ${z.prettifyError(error)}\x1b[0m`);
  process.exit(1);
}

export const {
  ACCESS_JWT_SECRET,
  DB_NAME,
  CLIENT_BASE_URL,
  MONGO_URI,
  /*BACKEND_USER_URL,*/
  REFRESH_TOKEN_TTL,
  ACCESS_TOKEN_TTL,
  SALT_ROUNDS,
  AI_API_KEY,
  AI_MODEL,
  AI_URL
} = data;
