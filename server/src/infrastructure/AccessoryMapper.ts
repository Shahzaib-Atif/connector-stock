import { AccessoryDto } from '@shared/dto/AccessoryDto';
import { REG_AccessoriesSamples } from 'src/generated/prisma/client';

export class AccessoryMapper {
  static toAccessoryDto(data: REG_AccessoriesSamples): AccessoryDto {
    return {
      ...data,
      Id: data.id,
      customId: this.constructAccessoryId(data),
      CapotAngle: data.CapotAngle?.toString() ?? null,
      ClipColor: data.ClipColor,
      RefClient: data.RefClient,
    };
  }

  // Construct a custom ID using ConnName, RefClient, and RefDV
  private static constructAccessoryId(data: REG_AccessoriesSamples) {
    const { ConnName, RefClient, RefDV } = data;

    if (RefDV) return `${ConnName}_${RefClient}_${RefDV}`;
    else return `${ConnName}_${RefClient}`;
  }
}
