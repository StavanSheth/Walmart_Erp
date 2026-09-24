import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string({
      required_error: "NEXT_PUBLIC_API_URL is required in production"
    })
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    (isProduction ? undefined : "http://localhost:4000/api")
});
