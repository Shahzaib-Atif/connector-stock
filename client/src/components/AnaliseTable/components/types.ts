import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";

export interface LineStatusContext {
  enc: string;
  line: string | number;
}

export interface UpdateConnNameOptions {
  skipCacheRefresh?: boolean;
  skipDivDeskLaunch?: boolean;
}

export interface ConnNameUpdateTarget {
  enc: string;
  line: string | number;
  con: string;
}

export interface ReclickStep extends ConnNameUpdateTarget {
  label: string;
  previousConnector?: string;
}

export interface PendingSave {
  row: AnaliseTabDto;
  newConnector: string;
  similarRows: AnaliseTabDto[];
}

export interface ReclickWizard {
  steps: ReclickStep[];
  currentStep: number;
  newConnector: string;
}
