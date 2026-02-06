import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';
import { UpdateAccessoryDto } from 'src/dtos/accessory.dto';

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

  async getAccessories() {
    try {
      return await this.prisma.rEG_AccessoriesSamples.findMany({
        select: {
          ConnName: true,
          AccessoryType: true,
          RefClient: true,
          Qty: true,
          CapotAngle: true,
          ClipColor: true,
          RefDV: true,
        },
      });
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async findAccessories(searchItem: string) {
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

  // update stock
  async update(searchItem: string, amount: number, tx?: TransactionClient) {
    try {
      const client = tx || this.prisma;
      return await client.rEG_AccessoriesSamples.updateMany({
        where: {
          AccImagePath: {
            contains: searchItem,
          },
        },
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
    searchItem: string,
    delta: number,
  ) {
    if (!searchItem || !delta) return;

    await tx.rEG_AccessoriesSamples.updateMany({
      where: {
        AccImagePath: {
          contains: searchItem,
        },
      },
      data: { Qty: { increment: delta } },
    });
  }

  async updateAccessoryProperties(
    searchItem: string,
    data: UpdateAccessoryDto,
  ) {
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
        where: {
          AccImagePath: {
            contains: searchItem,
          },
        },
        data: updateData,
      });
    } catch (ex: any) {
      console.error('Error updating accessory properties:', ex.message);
      throw ex;
    }
  }
}
