export interface PrintLabelDto {
  itemId: string;
  itemUrl: string;
  refCliente?: string;
  encomenda?: string;
  source?: 'box' | 'connector' | 'sample';
  qty?: number;
  printer?: string;
  useSmallLabels?: boolean;
}
