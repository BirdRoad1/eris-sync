import fs from 'fs/promises';
import fsOld from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Readable } from 'stream';
import { env } from '../env/env';
import { pipeline } from 'stream/promises';

export class ContentDelivery {
  private static sanitizeFileName(fileName: string) {
    let path = fileName
      .replaceAll(/[^A-Za-z0-9._-]/g, '')
      .toLowerCase()
      .substring(0, 255);

    if (path.length === 0) {
      path = 'file.bin';
    }

    return path;
  }

  static secureTestPath(testPath: string) {
    const realpath = path.resolve(testPath);
    return !path
      .relative(path.resolve(env.STORAGE_PATH), realpath)
      .startsWith('..');
  }

  static async createObjectPath(fileName: string) {
    try {
      await fs.stat(env.STORAGE_PATH);
    } catch {
      throw new Error('The output directory does not exist');
    }

    if (!path.isAbsolute(env.STORAGE_PATH)) {
      throw new Error('Output directory must be absolute');
    }

    const sanitizedName = this.sanitizeFileName(fileName);

    const uuid = crypto.randomUUID();

    const absolutePath = path.join(env.STORAGE_PATH, uuid, sanitizedName);

    return { uuid, fileName: sanitizedName, path: absolutePath };
  }

  static async createObjectWriteStream(fileName: string) {
    const {
      uuid,
      fileName: outFileName,
      path: absPath
    } = await this.createObjectPath(fileName);

    await fs.mkdir(path.join(env.STORAGE_PATH, uuid), { recursive: true });

    if (!this.secureTestPath(absPath)) {
      throw new Error('Tried to write to external path:' + absPath);
    }

    return {
      uuid,
      fileName: outFileName,
      path: absPath,
      stream: await fsOld.createWriteStream(absPath)
    };
  }

  static async saveStreamToObject(fileName: string, stream: Readable) {
    const {
      uuid,
      path,
      fileName: newFileName,
      stream: objectStream
    } = await this.createObjectWriteStream(fileName);

    await pipeline(stream, objectStream);

    return {
      uuid,
      fileName: newFileName,
      path
    };
  }

  static async deleteObject(uuid: string) {
    if (
      !/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
        uuid
      )
    )
      throw new Error('Invalid UUID');

    const dir = path.join(env.STORAGE_PATH, uuid);
    const files = await fs.readdir(dir);
    if (files.length !== 1) {
      throw new Error('Directory has incorrect amount of files: ' + dir);
    }

    if (!this.secureTestPath(dir))
      throw new Error('Tried to delete external file:' + dir);
    await fs.rm(path.join(dir, files[0]));
    await fs.rmdir(dir);
  }
}
