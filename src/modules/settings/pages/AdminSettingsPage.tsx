import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Building2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { LogoUploader } from '../components/LogoUploader';
import {
  useDealershipSettings,
  useUpsertSettings,
} from '../hooks/useSettings';

const schema = z.object({
  businessName: z.string().min(2, 'Required').max(200),
  legalName: z.string().max(200).optional().or(z.literal('')),
  email: z.string().email('Enter a valid email').max(150),
  phone: z.string().max(30).optional().or(z.literal('')),
  address: z.string().min(2, 'Required').max(255),
  city: z.string().max(100).optional().or(z.literal('')),
  country: z.string().min(2, 'Required').max(100),
  websiteUrl: z.string().url().max(2000).optional().or(z.literal('')),
  defaultCurrency: z.string().length(3, 'Must be 3 characters'),
  timezone: z.string().max(60),
});

type FormValues = z.infer<typeof schema>;

export function AdminSettingsPage() {
  const { data: settings, isLoading } = useDealershipSettings();
  const upsert = useUpsertSettings();

  // Logo lives outside the form (upload → URL)
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      defaultCurrency: 'USD',
      timezone: 'Asia/Kabul',
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        businessName: settings.businessName,
        legalName: settings.legalName ?? '',
        email: settings.email,
        phone: settings.phone ?? '',
        address: settings.address,
        city: settings.city ?? '',
        country: settings.country,
        websiteUrl: settings.websiteUrl ?? '',
        defaultCurrency: settings.defaultCurrency,
        timezone: settings.timezone,
      });
      setLogoUrl(settings.logoUrl);
    }
  }, [settings, reset]);

  if (isLoading) return <FullPageSpinner />;

  const logoChanged = (logoUrl ?? null) !== (settings?.logoUrl ?? null);

  const onSubmit = (values: FormValues) => {
    upsert.mutate({
      businessName: values.businessName.trim(),
      legalName: values.legalName?.trim() || null,
      email: values.email.trim().toLowerCase(),
      phone: values.phone?.trim() || null,
      address: values.address.trim(),
      city: values.city?.trim() || null,
      country: values.country.trim(),
      logoUrl: logoUrl || null,
      websiteUrl: values.websiteUrl?.trim() || null,
      defaultCurrency: values.defaultCurrency.toUpperCase(),
      timezone: values.timezone.trim(),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Dealership Settings"
        description="Business information shown across the system"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Branding</CardTitle>
            <CardDescription>
              Logo appears in the header, footer, and favicon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogoUploader value={logoUrl} onChange={setLogoUrl} />
          </CardContent>
        </Card>

        {/* Business info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-4 w-4" />
              Business information
            </CardTitle>
            <CardDescription>
              Public details that appear on the storefront.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="businessName">Business name *</Label>
              <Input id="businessName" {...register('businessName')} />
              {errors.businessName && (
                <p className="text-xs text-destructive">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="legalName">Legal name</Label>
              <Input id="legalName" {...register('legalName')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" {...register('address')} />
              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register('city')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" {...register('country')} />
              {errors.country && (
                <p className="text-xs text-destructive">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input id="websiteUrl" {...register('websiteUrl')} />
              {errors.websiteUrl && (
                <p className="text-xs text-destructive">
                  {errors.websiteUrl.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Localization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default currency</Label>
              <Input
                id="defaultCurrency"
                maxLength={3}
                {...register('defaultCurrency')}
              />
              {errors.defaultCurrency && (
                <p className="text-xs text-destructive">
                  {errors.defaultCurrency.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" {...register('timezone')} />
              {errors.timezone && (
                <p className="text-xs text-destructive">
                  {errors.timezone.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={(!isDirty && !logoChanged) || upsert.isPending}
          >
            {upsert.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}