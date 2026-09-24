import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { useAppSettings } from '@/modules/settings/context/SettingsContext';

export function ContactPage() {
  const { businessName, email, phone, address, city, country, website } =
    useAppSettings();

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <PageHeader
          title="Contact Us"
          description={`Get in touch with ${businessName}`}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Contact details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reach us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {phone && (
                <ContactRow
                  Icon={Phone}
                  label="Phone"
                  value={phone}
                  href={`tel:${phone}`}
                />
              )}
              {email && (
                <ContactRow
                  Icon={Mail}
                  label="Email"
                  value={email}
                  href={`mailto:${email}`}
                />
              )}
              {(address || city || country) && (
                <ContactRow
                  Icon={MapPin}
                  label="Address"
                  value={[address, city, country].filter(Boolean).join(', ')}
                />
              )}
              {website && (
                <ContactRow
                  Icon={MapPin}
                  label="Website"
                  value={website}
                  href={website}
                />
              )}
            </CardContent>
          </Card>

          {/* Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-4 w-4" />
                Opening hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <HoursRow day="Monday – Friday" hours="9:00 – 18:00" />
              <HoursRow day="Saturday" hours="10:00 – 16:00" />
              <HoursRow day="Sunday" hours="Closed" />
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-lg font-semibold">Visit our showroom</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Come see our collection in person. Our team will help you find
              the perfect vehicle.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ContactRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href ? (
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="break-words text-sm font-medium hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="break-words text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

function HoursRow({ day, hours }: { day: string; hours: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{day}</span>
      <span className="font-medium">{hours}</span>
    </div>
  );
}