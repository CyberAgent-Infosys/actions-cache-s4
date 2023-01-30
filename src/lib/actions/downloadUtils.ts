import { HttpClient, HttpClientResponse } from '@actions/http-client';
import { GetObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as stream from 'stream';
import * as util from 'util';

import * as utils from '@/lib/actions/cacheUtils';
import { SocketTimeout } from '@/lib/actions/constants';
import { retryHttpClientResponse } from '@/lib/actions/requestUtils';
import { logDebug, logInfo } from '@/lib/actions/core';

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
 * Class for tracking the download state and displaying stats.
 */
export class DownloadProgress {
  contentLength: number;
  segmentIndex: number;
  segmentSize: number;
  segmentOffset: number;
  receivedBytes: number;
  startTime: number;
  displayedComplete: boolean;
  timeoutHandle?: ReturnType<typeof setTimeout>;

  constructor(contentLength: number) {
    this.contentLength = contentLength;
    this.segmentIndex = 0;
    this.segmentSize = 0;
    this.segmentOffset = 0;
    this.receivedBytes = 0;
    this.displayedComplete = false;
    this.startTime = Date.now();
  }

  /**
   * Progress to the next segment. Only call this method when the previous segment
   * is complete.
   *
   * @param segmentSize the length of the next segment
   */
  nextSegment(segmentSize: number): void {
    this.segmentOffset = this.segmentOffset + this.segmentSize;
    this.segmentIndex = this.segmentIndex + 1;
    this.segmentSize = segmentSize;
    this.receivedBytes = 0;

    logDebug(`Downloading segment at offset ${this.segmentOffset} with length ${this.segmentSize}...`);
  }

  /**
   * Sets the number of bytes received for the current segment.
   *
   * @param receivedBytes the number of bytes received
   */
  setReceivedBytes(receivedBytes: number): void {
    this.receivedBytes = receivedBytes;
  }

  /**
   * Returns the total number of bytes transferred.
   */
  getTransferredBytes(): number {
    return this.segmentOffset + this.receivedBytes;
  }

  /**
   * Returns true if the download is complete.
   */
  isDone(): boolean {
    return this.getTransferredBytes() === this.contentLength;
  }

  /**
   * Prints the current download stats. Once the download completes, this will print one
   * last line and then stop.
   */
  display(): void {
    if (this.displayedComplete) {
      return;
    }

    const transferredBytes = this.segmentOffset + this.receivedBytes;
    const percentage = (100 * (transferredBytes / this.contentLength)).toFixed(1);
    const elapsedTime = Date.now() - this.startTime;
    const downloadSpeed = (transferredBytes / (1024 * 1024) / (elapsedTime / 1000)).toFixed(1);

    logInfo(`Received ${transferredBytes} of ${this.contentLength} (${percentage}%), ${downloadSpeed} MBs/sec`);

    if (this.isDone()) {
      this.displayedComplete = true;
    }
  }

  /**
   * Starts the timer that displays the stats.
   *
   * @param delayInMs the delay between each write
   */
  startDisplayTimer(delayInMs = 1000): void {
    const displayCallback = (): void => {
      this.display();

      if (!this.isDone()) {
        this.timeoutHandle = setTimeout(displayCallback, delayInMs);
      }
    };

    this.timeoutHandle = setTimeout(displayCallback, delayInMs);
  }

  /**
   * Stops the timer that displays the stats. As this typically indicates the download
   * is complete, this will display one last line, unless the last line has already
   * been written.
   */
  stopDisplayTimer(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = undefined;
    }

    this.display();
  }
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

/**
 * Download the cache using the AWS S3.  Only call this method if the use S3.
 *
 * @param key the key for the cache in S3
 * @param archivePath the local path where the cache is saved
 * @param s3Options: the option for AWS S3 client
 * @param s3BucketName: the name of bucket in AWS S3
 */
export async function downloadCacheStorageS3(
  key: string,
  archivePath: string,
  s3Options: S3ClientConfig,
  s3BucketName: string,
): Promise<void> {
  const s3client = new S3Client(s3Options);
  const param = {
    Bucket: s3BucketName,
    Key: key,
  };

  const response = await s3client.send(new GetObjectCommand(param));
  if (!response.Body) {
    throw new Error('Incomplete download. response.Body is undefined from S3.');
  }

  const fileStream = fs.createWriteStream(archivePath);

  const pipeline = util.promisify(stream.pipeline);
  await pipeline(response.Body as stream.Readable, fileStream);

  return;
}
