import { Response } from 'express';
import { ReadStream } from 'fs';
import { pipeline } from 'stream/promises';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export function applyImageCacheHeaders(
  res: Response,
  contentType: string,
  cacheSeconds = ONE_DAY_IN_SECONDS,
) {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', `public, max-age=${cacheSeconds}`);
}

export async function streamFileResponse(
  res: Response,
  stream: ReadStream,
): Promise<void> {
  const cleanup = () => {
    stream.destroy();
  };

  res.once('close', cleanup);
  res.once('error', cleanup);

  try {
    await pipeline(stream, res);
  } finally {
    res.off('close', cleanup);
    res.off('error', cleanup);
  }
}
