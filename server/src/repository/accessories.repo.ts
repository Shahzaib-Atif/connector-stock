import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';

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
}
