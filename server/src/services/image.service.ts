import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly basePath =
    '\\\\192.168.3.16\\Engenharia\\0. Old\\Disco_F\\CP-2005\\Fotos de Conectores - Base de Dados\\_ImageProcessor';

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
}
