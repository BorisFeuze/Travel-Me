import { z } from "zod/v4";

const envSchema = z.object({
  VITE_APP_USER_API_URL: z.url().default("http://localhost:4000"),
});

const { success, data, error } = envSchema.safeParse(import.meta.env);

if (!success) {
  console.error(
    `\x1b[31mInvalid environment variables:\n', ${z.prettifyError(
      error
    )}\x1b[0m`
  );
  process.exit(1);
}

export const { VITE_APP_USER_API_URL } = data;
