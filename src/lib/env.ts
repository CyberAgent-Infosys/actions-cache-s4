type PROCESS_ENV_KEY = 'GITHUB_REF' | 'GITHUB_EVENT_NAME' | 'GITHUB_SERVER_URL' | 'DEBUG_MODE';

export function getEnv(key: PROCESS_ENV_KEY): string | undefined {
  return process.env?.[key] ?? undefined;
}
