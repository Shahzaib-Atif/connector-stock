import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ImageService } from 'src/services/image.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Get image with connector Id' })
  @Get(':connectorId')
  getImage(@Param('connectorId') connectorId: string, @Res() res: Response) {
    const { contentType, stream } =
      this.imageService.getImageStream(connectorId);

    res.setHeader('Content-Type', contentType);
    stream.pipe(res);
  }
}
