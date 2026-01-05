import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly basePath = process.env.IMAGE_PROCESSOR_PATH;

  getImageStream(id: string, _type: 'connector' | 'accessory') {
    const possibleExtensions = ['.jpg', '.jpeg', '.png'];
    let fullPath: string | null = null;
    const _basePath =
      _type === 'connector' ? this.basePath : this.basePath + '\\_Accessories';

    for (const ext of possibleExtensions) {
      const fp = path.join(_basePath, `${id}${ext}`);

      if (fs.existsSync(fp)) {
        fullPath = fp;
        break;
      }
    }

    if (!fullPath) throw new Error('Image not found!');

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
    const stream = fs.createReadStream(fullPath);

    return { contentType, stream };
  }

  getRelatedImages(connectorId: string): string[] {
    const extrasPath = path.join(this.basePath, '_Extras');
    if (!fs.existsSync(extrasPath)) return [];

    try {
      const files = fs.readdirSync(extrasPath);
      // Filter files that include the connectorId (case-insensitive)
      return files.filter((file) =>
        file.toLowerCase().includes(connectorId.toLowerCase()),
      );
    } catch (e) {
      console.error('Error reading _Extras directory:', e.message);
      return [];
    }
  }

  getExtrasImageStream(filename: string) {
    const fullPath = path.join(this.basePath, '_Extras', filename);

    if (!fs.existsSync(fullPath)) throw new Error('Image not found!');

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
    const stream = fs.createReadStream(fullPath);

    return { contentType, stream };
  }
}
