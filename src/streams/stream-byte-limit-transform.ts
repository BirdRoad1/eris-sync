import { Transform, TransformCallback } from 'stream';

export class StreamByteLimitExceededError extends Error {
  constructor(max: number) {
    super(`Stream byte limit of ${max} exceeded!`);
  }
}

export class StreamByteLimitTransform extends Transform {
  bytesRead = 0;
  constructor(private maxBytes: number) {
    super();
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    this.bytesRead += chunk.byteLength;
    if (this.bytesRead >= this.maxBytes) {
      callback(new StreamByteLimitExceededError(this.maxBytes));
      return;
    }

    callback(null, chunk);
  }
}
