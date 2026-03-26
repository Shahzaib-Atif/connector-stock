import { Connector } from '@domain/entities/Connector';
import { ConnectorDetails } from '@domain/value-objects/ConnectorDetails';
import { ConnectorDimensions } from '@domain/value-objects/ConnectorDimensions';
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
      data.Connectors_Details
        ? new ConnectorDetails(
            data.Connectors_Details.Family,
            data.Connectors_Details.Fabricante ?? undefined,
            data.Connectors_Details.ActualViaCount ?? undefined,
          )
        : undefined,
      data.Connectors_Dimensions
        ? new ConnectorDimensions(
            data.Connectors_Dimensions.InternalDiameter?.toNumber(),
            data.Connectors_Dimensions.ExternalDiameter?.toNumber(),
            data.Connectors_Dimensions.Thickness?.toNumber(),
          )
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
      Connectors_Details: domain.details
        ? {
            Fabricante: domain.details.manufacturer ?? undefined,
            Family: domain.details.family,
            ActualViaCount: domain.details.actualViaCount,
          }
        : undefined,
      Connectors_Dimensions: domain.dimensions
        ? {
            InternalDiameter: domain.dimensions.internalDiameter,
            ExternalDiameter: domain.dimensions.externalDiameter,
            Thickness: domain.dimensions.thickness,
          }
        : undefined,
    };
  }
}
