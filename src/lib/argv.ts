import { InputParams, InputParamsKey, Inputs } from '@/@types/input';
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

export function getArgv(argv: string[]): Inputs {
  const inputs = parseArgv(argv);
  return {
    path: inputs.path ? strToArray(inputs?.path ?? '') : undefined,
    key: inputs.key,
    restoreKeys: inputs['restore-keys'] ? strToArray(inputs['restore-keys'] ?? '') : undefined,
    uploadChunkSize: inputs['upload-chunk-size'] ? parseInt(inputs?.['upload-chunk-size'] ?? '', 10) : undefined,
  };
}
