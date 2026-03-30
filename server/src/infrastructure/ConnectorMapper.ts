import { Connector } from '@domain/entities/Connector';
import { Quantity } from '@domain/value-objects/Quantity';
import { ConnectorDto } from '@shared/dto/ConnectorDto';
import { Prisma } from 'src/generated/prisma/client';

type PrismaConnector = Prisma.Connectors_MainGetPayload<{
  include: {
    Connectors_Details: true;
    Connectors_Dimensions: true;
  };
}>;

export class ConnectorMapper {
  static toDomain(data: PrismaConnector): Connector {
    return new Connector(
      data.CODIVMAC,
      data.PosId,
      data.Cor,
      data.Vias,
      data.ConnType ?? '',
      new Quantity(data.Qty, data.Qty_com_fio, data.Qty_sem_fio),
      data.Connectors_Details ?? undefined,
      data.Connectors_Dimensions
        ? {
            InternalDiameter:
              data.Connectors_Dimensions.InternalDiameter?.toNumber() ?? null,
            ExternalDiameter:
              data.Connectors_Dimensions.ExternalDiameter?.toNumber() ?? null,
            Thickness: data.Connectors_Dimensions.Thickness?.toNumber() ?? null,
          }
        : undefined,
    );
  }

  static toDto(domain: Connector): ConnectorDto {
    return {
      CODIVMAC: domain.id,
      PosId: domain.posId,
      Cor: domain.color,
      Vias: domain.vias,
      ConnType: domain.type,
      Qty: domain.quantity.total,
      Qty_com_fio: domain.quantity.withWire,
      Qty_sem_fio: domain.quantity.withoutWire,
      details: domain.details ?? null,
      dimensions: domain.dimensions ?? null,
      clientReferences: [],
    };
  }

  static prismaToDto(data: PrismaConnector): ConnectorDto {
    return {
      ...data,
      details: data.Connectors_Details,
      dimensions: data.Connectors_Dimensions
        ? {
            InternalDiameter:
              data.Connectors_Dimensions.InternalDiameter?.toNumber() ?? null,
            ExternalDiameter:
              data.Connectors_Dimensions.ExternalDiameter?.toNumber() ?? null,
            Thickness: data.Connectors_Dimensions.Thickness?.toNumber() ?? null,
          }
        : null,
      clientReferences: [],
    };
  }
}
