import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { getErrorMsg } from '@shared/utils/getErrorMsg';

@Injectable()
export class ImageService {
  private readonly connectorsBasePath: string;
  private readonly accessoriesBasePath: string;
  private readonly accessoriesExtrasPath: string;

  constructor() {
    this.connectorsBasePath = process.env.CONNECTORS_BASE_PATH ?? '';

    this.accessoriesBasePath = process.env.ACCESSORIES_BASE_PATH ?? '';
    this.accessoriesExtrasPath = this.accessoriesBasePath + '\\_Extras';
  }

  getImageStream(
    id: string,
    _type: 'connector' | 'accessory',
    _subType: string,
  ) {
    const possibleExtensions = ['.jpg', '.jpeg', '.png'];
    let fullPath: string | null = null;
    const _basePath =
      _type === 'connector'
        ? path.join(this.connectorsBasePath, _subType)
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

  getRelatedImagesForConnectors(
    connectorId: string,
    _subType: string,
  ): string[] {
    const extrasPath = path.join(this.connectorsBasePath, _subType, '_Extras');

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

  getExtrasImageStreamForConnectors(filename: string, _subType: string) {
    const fullPath = path.join(
      this.connectorsBasePath,
      _subType,
      '_Extras',
      filename,
    );

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
