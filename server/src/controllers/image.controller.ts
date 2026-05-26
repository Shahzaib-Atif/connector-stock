import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ImageService } from 'src/services/image.service';
import { getErrorMsg } from '@shared/utils/getErrorMsg';
import {
  applyImageCacheHeaders,
  streamFileResponse,
} from 'src/utils/stream-response.utils';

@Controller('api/images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Get connector image' })
  @Get('connector/:connectorId/:type')
  async getConnectorImage(
    @Param('connectorId') connectorId: string,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    try {
      const { contentType, stream } = this.imageService.getConnectorImage(
        connectorId,
        type,
      );

      applyImageCacheHeaders(res, contentType);
      await streamFileResponse(res, stream);
    } catch (e) {
      const errMsg = getErrorMsg(e);
      console.error(errMsg);
      if (!res.headersSent) {
        res.status(404).send(errMsg);
      }
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

      applyImageCacheHeaders(res, contentType);
      await streamFileResponse(res, stream);
    } catch (e) {
      console.error(getErrorMsg(e));
      if (!res.headersSent) {
        res.sendStatus(404);
      }
    }
  }

  @ApiOperation({ summary: 'Get related images filenames' })
  @Get('extras/:connectorId/:type')
  getRelatedImages(
    @Param('connectorId') connectorId: string,
    @Param('type') type: string,
  ) {
    return this.imageService.getRelatedImagesForConnectors(connectorId, type);
  }

  @ApiOperation({ summary: 'Get individual extras image' })
  @Get('extras/file/:connectorId/:type')
  async getExtrasImage(
    @Param('connectorId') connectorId: string,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    try {
      const { contentType, stream } =
        this.imageService.getExtrasImageStreamForConnectors(connectorId, type);

      applyImageCacheHeaders(res, contentType);
      await streamFileResponse(res, stream);
    } catch (e) {
      console.error(getErrorMsg(e));
      if (!res.headersSent) {
        res.sendStatus(404);
      }
    }
  }

  @ApiOperation({ summary: 'Get related accessory images filenames' })
  @Get('accessory-extras/:accessoryId')
  getRelatedAccessoryImages(@Param('accessoryId') accessoryId: string) {
    return this.imageService.getRelatedImagesForAccessories(accessoryId);
  }

  @ApiOperation({ summary: 'Get individual accessory extras image' })
  @Get('accessory-extras/file/:filename')
  async getAccessoryExtrasImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const { contentType, stream } =
        this.imageService.getExtrasImageStreamForAccessories(filename);

      applyImageCacheHeaders(res, contentType);
      await streamFileResponse(res, stream);
    } catch (e) {
      console.error(getErrorMsg(e));
      if (!res.headersSent) {
        res.sendStatus(404);
      }
    }
  }
}
