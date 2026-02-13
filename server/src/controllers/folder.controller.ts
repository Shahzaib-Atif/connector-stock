import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FolderService } from 'src/services/folder.service';
import getErrorMsg from 'src/utils/getErrorMsg';

@ApiTags('Folder')
@Controller('api/folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @ApiOperation({ summary: 'Open a local folder' })
  @Post('open')
  async openFolder(
    @Body('folderName') folderName: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.folderService.openFolder(folderName);
      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      console.error(getErrorMsg(e));
      return res.sendStatus(404);
    }
  }
}
