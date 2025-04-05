import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  runtimeEnv: process.env,
  server: {
    MAILGUN_API_KEY: z.string(),
    MAILGUN_DOMAIN: z.string(),
    MAILGUN_FROM: z.string(),
    SESSION_SECRET: z.string(),
    DATABASE_URL: z.string(),
  },
});

