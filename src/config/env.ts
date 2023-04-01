/* eslint-disable */
import { z } from 'zod';
import { StorageProvider } from '@shared/container/providers/StorageProvider/types/StorageProvider';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const envVars = z.object({
  CHATGPT_TOKEN: z.string(),
  CHATGPT_MODEL: z.string(),
  STORAGE_PROVIDER: z.nativeEnum(StorageProvider),
  S3_BUCKET_NAME: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVars> {}
  }
}

let env: z.infer<typeof envVars> = process.env;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const parsed = envVars.safeParse(env);

  if (parsed.success === false) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error(`Invalid environment variables: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
  }

  env = parsed.data;
}

export { env };
