import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';
import { DefaultRetryAttempts } from '@/lib/actions/constants';
import { sleep } from '@/lib/sleep';

export async function fetchRetry(url: RequestInfo, init: RequestInit | undefined = undefined): Promise<Response> {
  let error;
  for (let i = 0; i < DefaultRetryAttempts; i++) {
    try {
      return fetch(url, init);
    } catch (e) {
      error = e;
      await sleep(3000);
    }
  }
  throw error;
}
