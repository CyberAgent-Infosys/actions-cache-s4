import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';
import { DefaultRetryAttempts } from '@/lib/actions/constants';
import { wait } from '@/lib/wait';

export async function fetchRetry(url: RequestInfo, init: RequestInit | undefined = undefined): Promise<Response> {
  let error;
  for (let i = 0; i < DefaultRetryAttempts; i++) {
    try {
      return fetch(url, init);
    } catch (e) {
      error = e;
      await wait({ milliseconds: 3000 });
    }
  }
  throw error;
}
