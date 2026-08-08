export enum AnalyticsJobName {
  DEAL_WON = 'deal-won',
  LEAD_CONVERTED = 'lead-converted',
}

export interface DealWonJob {
  teamId: string;
  dealId: string;
}

export interface LeadConvertedJob {
  teamId: string;
  leadId: string;
}

export type AnalyticsJobData =
  | DealWonJob
  | LeadConvertedJob;