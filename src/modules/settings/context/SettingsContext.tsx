import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { useDealershipSettings } from '../hooks/useSettings';
import type { DealershipSettings } from '../api/settings.types';

interface SettingsContextValue {
  settings: DealershipSettings | null;
  isLoading: boolean;
  /** Convert a relative upload URL to an absolute URL. */
  resolveAssetUrl: (url: string | null | undefined) => string | null;
  /** Convenience getters with safe fallbacks. */
  businessName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  logoUrl: string | null;
  defaultCurrency: string;
  timezone: string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

// Fallback values used before settings are loaded
const FALLBACK_BUSINESS_NAME = 'Car Dealership';
const FALLBACK_EMAIL = 'info@example.com';
const FALLBACK_PHONE = '';
const FALLBACK_ADDRESS = '';
const FALLBACK_CITY = '';
const FALLBACK_COUNTRY = '';
const FALLBACK_WEBSITE = '';
const FALLBACK_CURRENCY = 'USD';
const FALLBACK_TIMEZONE = 'UTC';

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, '') ||
  'http://localhost:5000';

/**
 * SettingsProvider loads the dealership settings once and shares them
 * with the whole app. It also updates the favicon dynamically.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useDealershipSettings();

  const settings = data ?? null;

  const resolveAssetUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Relative path from uploads (e.g. /uploads/logos/logo-xxx.png)
    return `${API_BASE}${url}`;
  };

  const logoUrl = settings ? resolveAssetUrl(settings.logoUrl) : null;

  // Dynamically update the favicon from the logo
  useEffect(() => {
    if (!logoUrl) return;

    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = logoUrl;
  }, [logoUrl]);

  const value: SettingsContextValue = {
    settings,
    isLoading,
    resolveAssetUrl,

    businessName: settings?.businessName ?? FALLBACK_BUSINESS_NAME,
    email: settings?.email ?? FALLBACK_EMAIL,
    phone: settings?.phone ?? FALLBACK_PHONE,
    address: settings?.address ?? FALLBACK_ADDRESS,
    city: settings?.city ?? FALLBACK_CITY,
    country: settings?.country ?? FALLBACK_COUNTRY,
    website: settings?.websiteUrl ?? FALLBACK_WEBSITE,
    logoUrl,
    defaultCurrency: settings?.defaultCurrency ?? FALLBACK_CURRENCY,
    timezone: settings?.timezone ?? FALLBACK_TIMEZONE,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useAppSettings must be used within SettingsProvider');
  }
  return ctx;
}