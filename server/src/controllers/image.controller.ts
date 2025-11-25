import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('images')
export class ImageController {
  private readonly basePath =
    '\\\\192.168.3.16\\Engenharia\\0. Old\\Disco_F\\CP-2005\\Fotos de Conectores - Base de Dados\\_ImageProcessor';

  @ApiOperation({ summary: 'Get image with connector Id' })
  @Get(':connectorId')
  getImage(@Param('connectorId') connectorId: string, @Res() res: Response) {
    // Assuming filenames follow some format like "<id>.jpg"
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
    res.setHeader('Content-Type', contentType);
    const stream = fs.createReadStream(fullPath);
    stream.pipe(res);
  }
}
