import * as fs from 'fs';
import * as stream from 'stream';
import * as util from 'util';
import { HttpClient, HttpClientResponse } from '@actions/http-client';
import * as utils from '@/lib/actions/cacheUtils';
import { SocketTimeout } from '@/lib/actions/constants';
import { logDebug } from '@/lib/actions/core';
import { retryHttpClientResponse } from '@/lib/actions/requestUtils';

/**
 * Pipes the body of a HTTP response to a stream
 *
 * @param response the HTTP response
 * @param output the writable stream
 */
async function pipeResponseToStream(response: HttpClientResponse, output: NodeJS.WritableStream): Promise<void> {
  const pipeline = util.promisify(stream.pipeline);
  await pipeline(response.message, output);
}

/**
 * Download the cache using the Actions toolkit http-client
 *
 * @param archiveLocation the URL for the cache
 * @param archivePath the local path where the cache is saved
 */
export async function downloadCacheHttpClient(archiveLocation: string, archivePath: string): Promise<void> {
  const writeStream = fs.createWriteStream(archivePath);
  const httpClient = new HttpClient('actions/cache');
  const downloadResponse = await retryHttpClientResponse('downloadCache', async () => httpClient.get(archiveLocation));

  // Abort download if no traffic received over the socket.
  downloadResponse.message.socket.setTimeout(SocketTimeout, () => {
    downloadResponse.message.destroy();
    logDebug(`Aborting download, socket timed out after ${SocketTimeout} ms`);
  });

  await pipeResponseToStream(downloadResponse, writeStream);

  // Validate download size.
  const contentLengthHeader = downloadResponse.message.headers['content-length'];

  if (contentLengthHeader) {
    const expectedLength = parseInt(contentLengthHeader);
    const actualLength = utils.getArchiveFileSizeInBytes(archivePath);

    if (actualLength !== expectedLength) {
      throw new Error(`Incomplete download. Expected file size: ${expectedLength}, actual file size: ${actualLength}`);
    }
  } else {
    logDebug('Unable to validate download, no Content-Length header');
  }
}
