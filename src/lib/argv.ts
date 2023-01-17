import { InputParams, InputParamsKey, Inputs } from '@/@types/input';
import { strToBool } from '@/lib/strToBool';
import { strToArray } from '@/lib/strToArray';

export function parseArgv(argv: string[]): Record<InputParamsKey, string | undefined> {
  const optionArray = argv
    .filter(v => /(^--)/.test(v))
    .map(v => v.replace(/^--/, ''))
    .map((v: string): Partial<InputParams> => {
      const [key, value] = v.split('=') as [InputParamsKey, string];
      return { [key]: value };
    })
    .filter((v: Partial<InputParams>) => !('' in v));

  return Object.assign({}, ...optionArray);
}

export function getArgv(argv: string[]): Partial<Inputs> {
  const inputs = parseArgv(argv);
  return {
    path: inputs.path ? strToArray(inputs?.path ?? '') : undefined,
    key: inputs.key,
    restoreKeys: inputs['restore-keys'] ? strToArray(inputs['restore-keys'] ?? '') : undefined,
    uploadChunkSize: inputs['upload-chunk-size'] ? parseInt(inputs?.['upload-chunk-size'] ?? '', 10) : undefined,
    awsS3Bucket: inputs['aws-s3-bucket'],
    awsAccessKeyId: inputs['aws-access-key-id'],
    awsSecretAccessKey: inputs['aws-secret-access-key'],
    awsRegion: inputs['aws-region'],
    awsEndpoint: inputs['aws-endpoint'],
    awsS3BucketEndpoint: strToBool(inputs['aws-s3-bucket-endpoint']),
    awsS3ForcePathStyle: strToBool(inputs['aws-s3-force-path-style']),
  };
}