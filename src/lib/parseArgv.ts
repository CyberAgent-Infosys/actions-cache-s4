import { InputName, InputValue, InputParams } from '@/@types/argv';

export const parseArgv = (argv: string[]): Record<InputName, InputValue> => {
  const optionArray = argv
    .filter(v => /(^--)/.test(v))
    .map(v => v.replace(/^--/, ''))
    .map((v: string): Partial<InputParams> => {
      const [key = '', value = '']: string[] = v.split('=');
      return { [key]: value };
    })
    .filter((v: Partial<InputParams>) => !('' in v));

  const option: Partial<InputParams> = Object.assign({}, ...optionArray);

  // TODO: 型変換
  // TODO: 意図的にundefined返すか初期値入れるかは実装してから考える
  if (option['upload-chunk-size']) option['upload-chunk-size'] = Number(option['upload-chunk-size']);

  // TODO: validationと初期値があれば考える
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
    'aws-s3-bucket-endpoint': option['aws-s3-bucket-endpoint'] ?? true,
    'aws-s3-force-path-style': option['aws-s3-force-path-style'] ?? false,
  };
};
