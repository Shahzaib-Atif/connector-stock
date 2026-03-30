import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ImageService } from 'src/services/image.service';
import { getErrorMsg } from '@shared/utils/getErrorMsg';

@Controller('api/images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Get connector image' })
  @Get('connector/:connectorId/:type')
  getConnectorImage(
    @Param('connectorId') connectorId: string,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    try {
      const { contentType, stream } = this.imageService.getConnectorImage(
        connectorId,
        type,
      );

      res.setHeader('Content-Type', contentType);
      stream.pipe(res);
    } catch (e) {
      const errMsg = getErrorMsg(e);
      console.error(errMsg);
      res.status(404).send(errMsg);
    }
  }

  @ApiOperation({ summary: 'Get connector image' })
  @Get('accessory/:accessoryId')
  async getImages(
    @Param('accessoryId') accessoryId: number,
    @Res() res: Response,
  ) {
    try {
      const { contentType, stream } =
        await this.imageService.getAccessoryImage(accessoryId);

      res.setHeader('Content-Type', contentType);
      stream.pipe(res);
    } catch (e) {
      console.error(getErrorMsg(e));
      res.sendStatus(404);
    }
  }

  @ApiOperation({ summary: 'Get related images filenames' })
  @Get('extras/:connectorId/:type')
  getRelatedImages(
    @Param('connectorId') connectorId: string,
    @Param('type') type: string,
  ) {
    console.log(connectorId, type);

    return this.imageService.getRelatedImagesForConnectors(connectorId, type);
  }

  @ApiOperation({ summary: 'Get individual extras image' })
  @Get('extras/file/:connectorId/:type')
  getExtrasImage(
    @Param('connectorId') connectorId: string,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    try {
      const { contentType, stream } =
        this.imageService.getExtrasImageStreamForConnectors(connectorId, type);

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
