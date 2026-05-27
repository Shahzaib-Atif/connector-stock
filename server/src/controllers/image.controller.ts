import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ImageService } from 'src/services/image.service';
import { getErrorMsg } from '@shared/utils/getErrorMsg';
import { MemoryTelemetryService } from 'src/services/memory-telemetry.service';
import {
  applyImageCacheHeaders,
  streamFileResponse,
} from 'src/utils/stream-response.utils';

@Controller('api/images')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly memoryTelemetry: MemoryTelemetryService,
  ) {}

  @ApiOperation({ summary: 'Get connector image' })
  @Get('connector/:connectorId/:type')
  async getConnectorImage(
    @Param('connectorId') connectorId: string,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    const shouldSample = this.memoryTelemetry.shouldSampleImageRequest();
    if (shouldSample) {
      await this.memoryTelemetry.capture('image', 'before-connector-image', {
        connectorId,
        type,
      });
    }

    try {
      const { contentType, stream } = this.imageService.getConnectorImage(
        connectorId,
        type,
      );

      applyImageCacheHeaders(res, contentType);
      await streamFileResponse(res, stream);
      if (shouldSample) {
        await this.memoryTelemetry.capture('image', 'after-connector-image', {
          connectorId,
          type,
        });
      }
    } catch (e) {
      const errMsg = getErrorMsg(e);
      console.error(errMsg);
      if (shouldSample) {
        await this.memoryTelemetry.capture('image', 'connector-image-error', {
          connectorId,
          type,
          error: errMsg,
        });
      }
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
    const shouldSample = this.memoryTelemetry.shouldSampleImageRequest();
    if (shouldSample) {
      await this.memoryTelemetry.capture('image', 'before-accessory-image', {
        accessoryId,
      });
    }

    try {
      const { contentType, stream } =
        await this.imageService.getAccessoryImage(accessoryId);

      applyImageCacheHeaders(res, contentType);
      await streamFileResponse(res, stream);
      if (shouldSample) {
        await this.memoryTelemetry.capture('image', 'after-accessory-image', {
          accessoryId,
        });
      }
    } catch (e) {
      const errMsg = getErrorMsg(e);
      console.error(errMsg);
      if (shouldSample) {
        await this.memoryTelemetry.capture('image', 'accessory-image-error', {
          accessoryId,
          error: errMsg,
        });
      }
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
    const shouldSample = this.memoryTelemetry.shouldSampleImageRequest();
    if (shouldSample) {
      await this.memoryTelemetry.capture('image', 'before-connector-extra', {
        connectorId,
        type,
      });
    }

    try {
      const { contentType, stream } =
        this.imageService.getExtrasImageStreamForConnectors(connectorId, type);

      applyImageCacheHeaders(res, contentType);
      await streamFileResponse(res, stream);
      if (shouldSample) {
        await this.memoryTelemetry.capture('image', 'after-connector-extra', {
          connectorId,
          type,
        });
      }
    } catch (e) {
      const errMsg = getErrorMsg(e);
      console.error(errMsg);
      if (shouldSample) {
        await this.memoryTelemetry.capture('image', 'connector-extra-error', {
          connectorId,
          type,
          error: errMsg,
        });
      }
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
    const shouldSample = this.memoryTelemetry.shouldSampleImageRequest();
    if (shouldSample) {
      await this.memoryTelemetry.capture('image', 'before-accessory-extra', {
        filename,
      });
    }

    try {
      const { contentType, stream } =
        this.imageService.getExtrasImageStreamForAccessories(filename);

      applyImageCacheHeaders(res, contentType);
      await streamFileResponse(res, stream);
      if (shouldSample) {
        await this.memoryTelemetry.capture('image', 'after-accessory-extra', {
          filename,
        });
      }
    } catch (e) {
      const errMsg = getErrorMsg(e);
      console.error(errMsg);
      if (shouldSample) {
        await this.memoryTelemetry.capture('image', 'accessory-extra-error', {
          filename,
          error: errMsg,
        });
      }
      if (!res.headersSent) {
        res.sendStatus(404);
      }
    }
  }
}
