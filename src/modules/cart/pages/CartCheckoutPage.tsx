import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { toast } from 'sonner';
import { normalizeError } from '@/shared/api/client';
import { formatCurrency } from '@/shared/lib/utils';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import {
  usePublicVehicle,
  useVehicleImages,
} from '@/modules/vehicles/hooks/useVehicles';
import { useCreateOrder } from '@/modules/orders/hooks/useOrders';

const schema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(5, 'Phone is required'),
  customerEmail: z.string().email('Enter a valid email'),
  customerAddress: z.string().optional().or(z.literal('')),
  customerNotes: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export function CartCheckoutPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: vehicle, isLoading, isError } = usePublicVehicle(vehicleId);
  const { data: images = [] } = useVehicleImages(vehicleId);
  const createOrder = useCreateOrder();

  const primaryImage = useMemo(
    () => images.find((i) => i.isPrimary) ?? images[0],
    [images]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      customerNotes: '',
    },
  });

  // Prefill from user
  useEffect(() => {
    if (user) {
      reset({
        customerName: user.name ?? '',
        customerPhone: user.phone ?? '',
        customerEmail: user.email ?? '',
        customerAddress: '',
        customerNotes: '',
      });
    }
  }, [user, reset]);

  if (isLoading) return <FullPageSpinner />;

  if (isError || !vehicle || !vehicleId) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/account/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to cart
          </Link>
        </Button>
        <EmptyState
          title="Vehicle not found"
          description="It may have been sold or removed."
          action={
            <Button asChild>
              <Link to="/account/cart">Back to cart</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const fullName = `${vehicle.year} ${vehicle.make} ${vehicle.model}${
    vehicle.trim ? ` ${vehicle.trim}` : ''
  }`;

  const onSubmit = (values: FormValues) => {
    createOrder.mutate(
      {
        items: [{ vehicleId }],
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail,
        customerAddress: values.customerAddress || null,
        customerNotes: values.customerNotes || null,
      },
      {
        onSuccess: (order) => {
          toast.success(`Order ${order.orderNumber} placed!`, {
            description: 'A staff member will contact you shortly.',
          });
          navigate(`/account/orders/${order.id}`);
        },
        onError: (err) => {
          const e = normalizeError(err);
          toast.error(e.message);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/account/cart">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to cart
        </Link>
      </Button>

      <PageHeader
        title="Place order request"
        description="Confirm your contact details to submit this order"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          id="checkout-form"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your contact information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="customerName">Full name *</Label>
                <Input id="customerName" {...register('customerName')} />
                {errors.customerName && (
                  <p className="text-xs text-destructive">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone *</Label>
                <Input id="customerPhone" {...register('customerPhone')} />
                {errors.customerPhone && (
                  <p className="text-xs text-destructive">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  {...register('customerEmail')}
                />
                {errors.customerEmail && (
                  <p className="text-xs text-destructive">
                    {errors.customerEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="customerAddress">Address</Label>
                <Input
                  id="customerAddress"
                  {...register('customerAddress')}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="customerNotes">
                  Message to staff (optional)
                </Label>
                <Textarea
                  id="customerNotes"
                  rows={3}
                  placeholder="e.g. Interested in a test drive this weekend."
                  {...register('customerNotes')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Confirmation info */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">How the order works</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                  <li>Submitting sends an order request — no payment is taken now.</li>
                  <li>A staff member will contact you to confirm details.</li>
                  <li>Once confirmed, the vehicle is reserved for you.</li>
                  <li>Final sale is completed in person or via a signed contract.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link to="/account/cart">Cancel</Link>
            </Button>
            <Button
              type="submit"
              form="checkout-form"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Place order
            </Button>
          </div>
        </form>

        {/* Vehicle summary */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-md border bg-muted">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={fullName}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold">{fullName}</p>
                <p className="text-xs text-muted-foreground">
                  Stock #{vehicle.stockNumber}
                </p>
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold">
                  {formatCurrency(vehicle.askingPrice, vehicle.currency)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Final price may be negotiated with staff.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}