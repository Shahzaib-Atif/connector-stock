import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

@Injectable()
export class FolderService {
  async openFolder(folderName: string): Promise<{ message: string }> {
    const basePath = process.env.FOLDER_BASE_PATH;

    if (!basePath) {
      throw new InternalServerErrorException(
        'FOLDER_BASE_PATH environment variable is not set.',
      );
    }

    if (!folderName) {
      throw new BadRequestException('Folder name is required.');
    }

    // Sanitize folderName to prevent directory traversal
    const safeFolderName = path.basename(folderName);
    const fullPath = path.join(basePath, safeFolderName);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(`Folder not found: ${fullPath}`);
    }

    return new Promise((resolve, reject) => {
      // Command to open folder on Windows
      const command = `start "" "${fullPath}"`;

      exec(command, (error) => {
        if (error) {
          console.error(`Error opening folder: ${error.message}`);
          reject(new InternalServerErrorException('Failed to open folder.'));
        } else {
          resolve({ message: 'Folder opened successfully.' });
        }
      });
    });
  }
}
