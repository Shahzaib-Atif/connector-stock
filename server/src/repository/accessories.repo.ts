import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';
import { AccessoryDto } from '@shared/dto/AccessoryDto';
import { AccessoryMapper } from '@infra/AccessoryMapper';

@Injectable()
export class AccessoryRepo {
  constructor(private prisma: PrismaService) {}

  async getAccessoryTypes() {
    try {
      return await this.prisma.accessoryTypes.findMany();
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getAccessories(): Promise<AccessoryDto[]> {
    try {
      const data = await this.prisma.rEG_AccessoriesSamples.findMany({});
      return data.map((a) => AccessoryMapper.toAccessoryDto(a));
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getAccessoriesCount(searchItem: string): Promise<number> {
    try {
      return await this.prisma.rEG_AccessoriesSamples.count({
        where: {
          AccImagePath: {
            contains: searchItem,
          },
        },
      });
    } catch (ex: any) {
      console.error(ex.message);
      return 0;
    }
  }

  async getAccessoryById(Id: number): Promise<AccessoryDto | null> {
    try {
      const data = await this.prisma.rEG_AccessoriesSamples.findFirst({
        where: {
          id: parseInt(Id.toString()),
        },
      });
      if (!data) return null;
      return AccessoryMapper.toAccessoryDto(data);
    } catch (ex: any) {
      console.error(ex.message);
      return null;
    }
  }

  // update stock
  async update(Id: number, amount: number, tx?: TransactionClient) {
    try {
      const client = tx || this.prisma;
      return await client.rEG_AccessoriesSamples.updateMany({
        where: { id: Id },
        data: {
          Qty: { increment: amount },
        },
      });
    } catch (ex: any) {
      console.error(ex.message);
      return null;
    }
  }

  async adjustQuantity(
    tx: TransactionClient,
    Id: number,
    delta: number,
  ): Promise<void> {
    if (!Id || !delta) return;

    await tx.rEG_AccessoriesSamples.updateMany({
      where: { id: Id },
      data: { Qty: { increment: delta } },
    });
  }

  async updateAccessoryProperties(Id: number, data: AccessoryDto) {
    try {
      const normalizedData = {
        CapotAngle: data.CapotAngle === '' ? undefined : data.CapotAngle,
        ClipColor: data.ClipColor === '' ? undefined : data.ClipColor,
        Qty: data.Qty,
      };

      const updateData = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(normalizedData).filter(([_, v]) => v !== undefined),
      );

      // Update the accessory
      return await this.prisma.rEG_AccessoriesSamples.updateMany({
        where: { id: Id },
        data: updateData,
      });
    } catch (ex: any) {
      console.error('Error updating accessory properties:', ex.message);
      throw ex;
    }
  }
}
