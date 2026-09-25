import { Mail, MapPin, Phone, Users, Award, Car } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { useAppSettings } from '@/modules/settings/context/SettingsContext';

export function AboutPage() {
  const { businessName, logoUrl, email, phone, address, city, country } =
    useAppSettings();

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={businessName}
              className="mb-6 h-20 w-20 rounded-xl object-contain"
            />
          )}
          <PageHeader
            title={`About ${businessName}`}
            description="Your trusted partner for quality vehicles"
          />
        </div>

        {/* Story */}
        <Card>
          <CardContent className="prose prose-sm max-w-none pt-6 text-muted-foreground">
            <p>
              {businessName} has been serving the community with quality new
              and pre-owned vehicles. We believe buying a car should be
              simple, transparent, and enjoyable.
            </p>
            <p className="mt-4">
              Our team of experienced professionals helps you find the right
              vehicle for your needs and budget. Every car in our inventory
              goes through a thorough inspection before it&apos;s offered for
              sale.
            </p>
            <p className="mt-4">
              Whether you&apos;re looking for a reliable commuter, a family
              SUV, or something sportier, we have the selection and expertise
              to help you drive home happy.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid gap-4 sm:grid-cols-3">
          <ValueCard
            Icon={Award}
            title="Quality"
            description="Every vehicle is inspected and verified."
          />
          <ValueCard
            Icon={Users}
            title="Trust"
            description="Honest pricing, no hidden fees."
          />
          <ValueCard
            Icon={Car}
            title="Selection"
            description="New, used, and certified pre-owned."
          />
        </div>

        {/* Contact card */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Visit us</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {address && (
                <InfoRow
                  Icon={MapPin}
                  label="Address"
                  value={[address, city, country].filter(Boolean).join(', ')}
                />
              )}
              {phone && (
                <InfoRow
                  Icon={Phone}
                  label="Phone"
                  value={phone}
                  href={`tel:${phone}`}
                />
              )}
              {email && (
                <InfoRow
                  Icon={Mail}
                  label="Email"
                  value={email}
                  href={`mailto:${email}`}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ValueCard({
  Icon,
  title,
  description,
}: {
  Icon: typeof Car;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: typeof Car;
  label: string;
  value: string;
  href?: string;
}) {
  const content = href ? (
    <a href={href} className="text-sm hover:underline">
      {value}
    </a>
  ) : (
    <span className="text-sm">{value}</span>
  );

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      {content}
    </div>
  );
}
