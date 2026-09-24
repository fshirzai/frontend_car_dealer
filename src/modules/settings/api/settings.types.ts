export interface DealershipSettings {
  id: string;
  businessName: string;
  legalName: string | null;
  email: string;
  phone: string | null;
  address: string;
  city: string | null;
  country: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  defaultCurrency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertSettingsInput {
  businessName: string;
  legalName?: string | null;
  email: string;
  phone?: string | null;
  address: string;
  city?: string | null;
  country: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  defaultCurrency?: string;
  timezone?: string;
}