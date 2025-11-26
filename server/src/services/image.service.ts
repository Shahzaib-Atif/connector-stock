import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly basePath =
    '\\\\192.168.3.16\\Engenharia\\0. Old\\Disco_F\\CP-2005\\Fotos de Conectores - Base de Dados\\_ImageProcessor';

  getImageStream(connectorId: string) {
    const possibleExtensions = ['.jpg', '.jpeg', '.png'];

    let fullPath: string | null = null;

    for (const ext of possibleExtensions) {
      const fp = path.join(this.basePath, `${connectorId}${ext}`);
      if (fs.existsSync(fp)) {
        fullPath = fp;
        break;
      }
    }

    if (!fullPath) {
      console.error('Image not found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
    const stream = fs.createReadStream(fullPath);

    return { contentType, stream };
  }
}
