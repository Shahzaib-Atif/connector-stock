import { Injectable } from '@nestjs/common';
import { UpdateAccessoryDto } from 'src/dtos/accessory.dto';
import { AccessoryRepo } from 'src/repository/accessories.repo';

@Injectable()
export class AccessoriesService {
  constructor(private readonly repo: AccessoryRepo) {}

  async updateAccessory(id: string, data: UpdateAccessoryDto) {
    const searchItem = id + '.';

    // check if id is valid
    if (!searchItem.includes('_')) throw new Error('Invalid accessory ID!');

    // only one such accessory should be present
    const count = await this.repo.findAccessories(searchItem);
    if (count < 1) throw new Error(`Accessory with ${id} not found!`);
    if (count > 1)
      throw new Error(`Accessory with ${id} returned multiple rows!`);

    return this.repo.updateAccessoryProperties(id, data);
  }
}
