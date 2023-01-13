import { InputName } from '@/@types/argv';
import { strToBool } from '@/lib/strToBool';
import { strToArray } from '@/lib/strToArray';

type InputParams = {
  path: string[];
  key: string;
  'restore-keys'?: string;
  'upload-chunk-size'?: number;
  'aws-s3-bucket': string;
  'aws-access-key-id': string;
  'aws-secret-access-key': string;
  'aws-region'?: string;
  'aws-endpoint'?: string;
  'aws-s3-bucket-endpoint'?: boolean;
  'aws-s3-force-path-style'?: boolean;
};

export function parseArgv(argv: string[]): Partial<InputParams> {
  const optionArray = argv
    .filter(v => /(^--)/.test(v))
    .map(v => v.replace(/^--/, ''))
    .map((v: string): Partial<InputParams> => {
      const [key, value] = v.split('=') as [InputName, string];

      // 型変換
      if ((['path'] as InputName[]).includes(key)) return { [key]: strToArray(value ?? '') };
      if ((['upload-chunk-size'] as InputName[]).includes(key)) return { [key]: parseInt(value, 10) };
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
}
