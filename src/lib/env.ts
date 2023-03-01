type PROCESS_ENV_KEY =
  | 'GITHUB_ACTION_SERVER_URL'
  | 'GITHUB_ACTION_REPOSITORY'
  | 'GATEWAY_END_POINT'
  | 'GITHUB_REF'
  | 'GITHUB_EVENT_NAME'
  | 'GITHUB_SERVER_URL'
  | 'GITHUB_WORKSPACE'
  | 'ACTIONS_CACHE_URL'
  | 'ACTIONS_RUNTIME_TOKEN'
  | 'RUNNER_TEMP'
  | 'USERPROFILE'
  | 'HOME'
  | 'TMP'
  | 'TMPDIR'
  | 'windir'
  | 'DEBUG_MODE'
  | 'IS_SILENT';

export function getEnv(key: PROCESS_ENV_KEY): string | undefined {
  return process.env?.[key] ?? undefined;
}
