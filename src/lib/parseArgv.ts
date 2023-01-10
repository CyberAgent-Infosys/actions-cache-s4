import { InputName, InputValue, InputParams } from '@/@types/argv';
import { strToBool } from '@/lib/strToBool';

export const parseArgv = (argv: string[]): Record<InputName, InputValue | undefined> => {
  const optionArray = argv
    .filter(v => /(^--)/.test(v))
    .map(v => v.replace(/^--/, ''))
    .map((v: string): Partial<InputParams> => {
      const [key, value] = v.split('=') as [InputName, string];

      // 型変換
      if ((['upload-chunk-size'] as InputName[]).includes(key)) return { [key]: Number(value) };
      if ((['aws-s3-bucket-endpoint', 'aws-s3-force-path-style'] as InputName[]).includes(key))
        return { [key]: strToBool(value) };
      return { [key]: value };
    })
    .filter((v: Partial<InputParams>) => !('' in v));

  const option: Partial<InputParams> = Object.assign({}, ...optionArray);

  return {
    path: option.path,
    key: option.key,
    'restore-keys': option['restore-keys'],
    'upload-chunk-size': option['upload-chunk-size'],
    'aws-s3-bucket': option['aws-s3-bucket'],
    'aws-access-key-id': option['aws-access-key-id'],
    'aws-secret-access-key': option['aws-secret-access-key'],
    'aws-region': option['aws-region'],
    'aws-endpoint': option['aws-endpoint'],
    'aws-s3-bucket-endpoint': option['aws-s3-bucket-endpoint'],
    'aws-s3-force-path-style': option['aws-s3-force-path-style'],
  };
};
