import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ImageService } from 'src/services/image.service';
import getErrorMsg from 'src/utils/getErrorMsg';

@Controller('api/images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Get connector image' })
  @Get('connector/:connectorId')
  getConnectorImage(
    @Param('connectorId') connectorId: string,
    @Res() res: Response,
  ) {
    try {
      const { contentType, stream } = this.imageService.getImageStream(
        connectorId,
        'connector',
      );

      res.setHeader('Content-Type', contentType);
      stream.pipe(res);
    } catch (e) {
      console.error(getErrorMsg(e));
      res.sendStatus(404);
    }
  }

  @ApiOperation({ summary: 'Get connector image' })
  @Get('accessory/:accessoryId')
  getImages(@Param('accessoryId') accessoryId: string, @Res() res: Response) {
    try {
      const { contentType, stream } = this.imageService.getImageStream(
        accessoryId,
        'accessory',
      );

      res.setHeader('Content-Type', contentType);
      stream.pipe(res);
    } catch (e) {
      console.error(getErrorMsg(e));
      res.sendStatus(404);
    }
  }

  @ApiOperation({ summary: 'Get related images filenames' })
  @Get('extras/:connectorId')
  getRelatedImages(@Param('connectorId') connectorId: string) {
    return this.imageService.getRelatedImagesForConnectors(connectorId);
  }

  @ApiOperation({ summary: 'Get individual extras image' })
  @Get('extras/file/:filename')
  getExtrasImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const { contentType, stream } =
        this.imageService.getExtrasImageStreamForConnectors(filename);

      res.setHeader('Content-Type', contentType);
      stream.pipe(res);
    } catch (e) {
      console.error(getErrorMsg(e));
      res.sendStatus(404);
    }
  }

  @ApiOperation({ summary: 'Get related accessory images filenames' })
  @Get('accessory-extras/:accessoryId')
  getRelatedAccessoryImages(@Param('accessoryId') accessoryId: string) {
    return this.imageService.getRelatedImagesForAccessories(accessoryId);
  }

  @ApiOperation({ summary: 'Get individual accessory extras image' })
  @Get('accessory-extras/file/:filename')
  getAccessoryExtrasImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const { contentType, stream } =
        this.imageService.getExtrasImageStreamForAccessories(filename);

      res.setHeader('Content-Type', contentType);
      stream.pipe(res);
    } catch (e) {
      console.error(getErrorMsg(e));
      res.sendStatus(404);
    }
  }
}
