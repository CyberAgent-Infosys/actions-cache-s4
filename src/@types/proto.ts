export type GatewayClientConfig = {
  paths: string[];
  key: string;
  restoreKeys: string[] | undefined;
  githubUrl: string;
  githubRepository: string;
  uploadChunkSize: number;
};
