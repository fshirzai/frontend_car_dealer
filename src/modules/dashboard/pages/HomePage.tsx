import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, Clock, Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useAppSettings } from '@/modules/settings/context/SettingsContext';

export function HomePage() {
  const { businessName, logoUrl } = useAppSettings();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            {logoUrl && (
              <img
                src={logoUrl}
                alt={businessName}
                className="mx-auto mb-8 h-16 w-16 rounded-xl object-contain"
              />
            )}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Find your next car with confidence
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Browse our curated inventory of quality new and pre-owned
              vehicles from {businessName}.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/vehicles">
                  Browse vehicles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="container py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          Why buy from us?
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <FeatureCard
            Icon={ShieldCheck}
            title="Verified inventory"
            description="Every vehicle goes through a strict inspection before it hits the lot."
          />
          <FeatureCard
            Icon={Award}
            title="Trusted quality"
            description="Certified pre-owned vehicles with transparent history and pricing."
          />
          <FeatureCard
            Icon={Clock}
            title="Fast & simple"
            description="Place an order request online — our team handles the rest."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to find your car?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Browse our full inventory and start your order online today.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/vehicles">
                <Search className="mr-2 h-4 w-4" />
                Browse vehicles
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  Icon,
  title,
  description,
}: {
  Icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}