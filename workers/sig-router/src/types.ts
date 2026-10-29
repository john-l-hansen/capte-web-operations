export type OfficeCode = 'la' | 'fr' | 'nl';

export interface CampaignConfig {
  id: string;
  name: string;
  office: OfficeCode | 'all';
  imageUrl: string;
  destinationUrl: string;
  utmCampaign: string;
  altText: string;
  startDate?: string; // ISO 8601
  endDate?: string;   // ISO 8601
  isActive: boolean;
}

export interface EmployeeProfile {
  id: string; // e.g. 'john' or 's.chen'
  fullName: string;
  pronouns?: string;
  jobTitle: string;
  email: string;
  office: OfficeCode;
  mobile: string;
  officePhone?: string;
  linkedin?: string;
}

export interface Env {
  ENVIRONMENT: string;
  DEFAULT_SITE_URL: string;
  DEFAULT_LOGO_URL: string;
  CAMPAIGNS_KV?: KVNamespace;
  WEBHOOK_SECRET?: string;
}
