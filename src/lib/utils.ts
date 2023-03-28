import { getEnv } from '@/lib/env';
import { strToBool } from '@/lib/strToBool';

export const isDebug = strToBool(getEnv('DEBUG_MODE')) ?? false;
export const isAnnoy = isDebug && (strToBool(getEnv('IS_ANNOY')) ?? false);
export const nodeEnv = getEnv('NODE_ENV');
