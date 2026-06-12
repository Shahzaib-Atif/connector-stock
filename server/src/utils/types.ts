import {
  CreateLineStatusLogDto,
  CreateUpdateConnNameLogDto,
} from '@shared/dto/DivDeskDtos';

export interface ParsedMessage {
  conector?: string;
  encomenda?: string;
  prodId?: string;
  wireType?: string;
  sample?: string;
}

export interface CreateLineStatusLogEntry extends CreateLineStatusLogDto {
  event: 'setLineStatus';
  datetime: string;
}

export interface CreateUpdateConnNameLogEntry
  extends CreateUpdateConnNameLogDto {
  event: 'updateConnName';
  datetime: string;
}
