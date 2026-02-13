import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import getErrorMsg from 'src/utils/getErrorMsg';

@Injectable()
export class ImageService {
  private readonly connectorsBasePath: string;
  private readonly accessoriesBasePath: string;
  private readonly connectorsExtrasPath: string;
  private readonly accessoriesExtrasPath: string;

  constructor() {
    this.connectorsBasePath = process.env.CONNECTORS_BASE_PATH ?? '';
    this.connectorsExtrasPath = this.connectorsBasePath + '\\_Extras';

    this.accessoriesBasePath = process.env.ACCESSORIES_BASE_PATH ?? '';
    this.accessoriesExtrasPath = this.accessoriesBasePath + '\\_Extras';
  }

  getImageStream(id: string, _type: 'connector' | 'accessory') {
    const possibleExtensions = ['.jpg', '.jpeg', '.png'];
    let fullPath: string | null = null;
    const _basePath =
      _type === 'connector'
        ? this.connectorsBasePath
        : this.accessoriesBasePath;

    for (const ext of possibleExtensions) {
      const fp = path.join(_basePath, `${id}${ext}`);

      if (fs.existsSync(fp)) {
        fullPath = fp;
        break;
      }
    }

    if (!fullPath) throw new Error(`Image not found: ${id}`);

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
    const stream = fs.createReadStream(fullPath);

    return { contentType, stream };
  }

  getRelatedImagesForConnectors(connectorId: string): string[] {
    const extrasPath = this.connectorsExtrasPath;
    if (!fs.existsSync(extrasPath)) {
      console.error('Path for extra images not found!');
      return [];
    }

    try {
      const files = fs.readdirSync(extrasPath);
      // Filter files that include the connectorId (case-insensitive)
      return files.filter((file) =>
        file.toLowerCase().includes(connectorId.toLowerCase()),
      );
    } catch (e) {
      console.error('Error reading _Extras directory:', getErrorMsg(e));
      return [];
    }
  }

  getExtrasImageStreamForConnectors(filename: string) {
    const fullPath = path.join(this.connectorsExtrasPath, filename);

    if (!fs.existsSync(fullPath))
      throw new Error(`Image not found: ${filename}`);

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
    const stream = fs.createReadStream(fullPath);

    return { contentType, stream };
  }

  getRelatedImagesForAccessories(accessoryId: string): string[] {
    const extrasPath = this.accessoriesExtrasPath;
    if (!fs.existsSync(extrasPath)) {
      console.error('Path for extra images not found!');
      return [];
    }

    try {
      const files = fs.readdirSync(extrasPath);
      // Filter files that include the accessoryId (case-insensitive)
      return files.filter((file) =>
        file.toLowerCase().includes(accessoryId.toLowerCase()),
      );
    } catch (e) {
      console.error(
        'Error reading _Accessories/_Extras directory:',
        getErrorMsg(e),
      );
      return [];
    }
  }

  getExtrasImageStreamForAccessories(filename: string) {
    const fullPath = path.join(this.accessoriesExtrasPath, filename);

    if (!fs.existsSync(fullPath))
      throw new Error(`Image not found: ${filename}`);

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
    const stream = fs.createReadStream(fullPath);

    return { contentType, stream };
  }
}
