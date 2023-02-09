import * as exec from '@actions/exec';
import * as glob from '@actions/glob';
import * as io from '@actions/io';
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';
import * as util from 'util';
import { v4 as uuidV4 } from 'uuid';
import { CacheFilename, CompressionMethod } from '@/lib/actions/constants';
import { logInfo, logDebug } from '@/lib/actions/core';
import { getEnv } from '@/lib/env';

const IS_WINDOWS = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';

// From https://github.com/actions/toolkit/blob/main/packages/tool-cache/src/tool-cache.ts#L23
export async function createTempDirectory(): Promise<string> {
  let tempDirectory = getEnv('RUNNER_TEMP') || '';

  if (!tempDirectory) {
    let baseLocation: string;
    if (IS_WINDOWS) {
      // On Windows use the USERPROFILE env variable
      baseLocation = getEnv('USERPROFILE') || getEnv('TMP') || 'C:\\';
    } else {
      if (IS_MAC) {
        baseLocation = getEnv('HOME') || getEnv('TMPDIR') || '/Users';
      } else {
        // FIXME: 生成先として適切か未検証
        baseLocation = getEnv('HOME') || getEnv('TMPDIR') || '/home';
      }
    }
    tempDirectory = path.join(baseLocation, 'actions', 'temp');
  }

  const dest = path.join(tempDirectory, uuidV4());
  await io.mkdirP(dest);
  return dest;
}

export function getArchiveFileSizeInBytes(filePath: string): number {
  return fs.statSync(filePath).size;
}

export async function resolvePaths(patterns: string[]): Promise<string[]> {
  const paths: string[] = [];
  const workspace = getEnv('GITHUB_WORKSPACE') ?? process.cwd();
  const globber = await glob.create(patterns.join('\n'), {
    implicitDescendants: false,
  });

  for await (const file of globber.globGenerator()) {
    const relativeFile = path.relative(workspace, file).replace(new RegExp(`\\${path.sep}`, 'g'), '/');
    logDebug(`Matched: ${relativeFile}`);
    // Paths are made relative so the tar entries are all relative to the root of the workspace.
    paths.push(`${relativeFile}`);
  }

  return paths;
}

export async function unlinkFile(filePath: fs.PathLike): Promise<void> {
  return util.promisify(fs.unlink)(filePath);
}

async function getVersion(app: string): Promise<string> {
  logDebug(`Checking ${app} --version`);
  let versionOutput = '';
  try {
    await exec.exec(`${app} --version`, [], {
      ignoreReturnCode: true,
      silent: true,
      listeners: {
        stdout: (data: Buffer): string => (versionOutput += data.toString()),
        stderr: (data: Buffer): string => (versionOutput += data.toString()),
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logInfo(err.message);
    } else {
      throw err;
    }
  }

  versionOutput = versionOutput.trim();
  logDebug(versionOutput);
  return versionOutput;
}

// Use zstandard if possible to maximize cache performance
export async function getCompressionMethod(): Promise<CompressionMethod> {
  if (IS_WINDOWS && !(await isGnuTarInstalled())) {
    // Disable zstd due to bug https://github.com/actions/cache/issues/301
    return CompressionMethod.Gzip;
  }

  const versionOutput = await getVersion('zstd');
  const version = semver.clean(versionOutput);

  if (!versionOutput.toLowerCase().includes('zstd command line interface')) {
    // zstd is not installed
    return CompressionMethod.Gzip;
  } else if (!version || semver.lt(version, 'v1.3.2')) {
    // zstd is installed but using a version earlier than v1.3.2
    // v1.3.2 is required to use the `--long` options in zstd
    return CompressionMethod.ZstdWithoutLong;
  } else {
    return CompressionMethod.Zstd;
  }
}

export function getCacheFileName(compressionMethod: CompressionMethod): string {
  return compressionMethod === CompressionMethod.Gzip ? CacheFilename.Gzip : CacheFilename.Zstd;
}

export async function isGnuTarInstalled(): Promise<boolean> {
  const versionOutput = await getVersion('tar');
  return versionOutput.toLowerCase().includes('gnu tar');
}

export function assertDefined<T>(name: string, value?: T): T {
  if (value === undefined) {
    throw Error(`Expected ${name} but value was undefiend`);
  }

  return value;
}

export function isGhes(): boolean {
  const ghUrl = new URL(getEnv('GITHUB_SERVER_URL') || 'https://github.com');
  return ghUrl.hostname.toUpperCase() !== 'GITHUB.COM';
}
