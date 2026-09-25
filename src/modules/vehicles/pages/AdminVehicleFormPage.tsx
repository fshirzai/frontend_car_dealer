import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { VehicleMediaSection } from '../components/VehicleMediaSection';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import {
  BODY_TYPE,
  FUEL_TYPE,
  TRANSMISSION,
  DRIVE_TYPE,
  VEHICLE_CONDITION,
  MILEAGE_UNIT,
} from '@/shared/types';
import {
  useCreateVehicle,
  useStaffVehicle,
  useUpdateVehicle,
} from '../hooks/useVehicles';
import type {
  BodyType,
  DriveType,
  FuelType,
  MileageUnit,
  Transmission,
  VehicleCondition,
} from '@/shared/types';
const schema = z.object({
  vin: z.string().max(30).optional().or(z.literal('')),
  engineNumber: z.string().max(30).optional().or(z.literal('')),
  make: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  year: z.coerce.number().int().min(1900).max(2100),
  trim: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
  bodyType: z.enum(Object.values(BODY_TYPE) as [string, ...string[]]),
  fuelType: z.enum(Object.values(FUEL_TYPE) as [string, ...string[]]),
  transmission: z.enum(Object.values(TRANSMISSION) as [string, ...string[]]),
  driveType: z.enum(Object.values(DRIVE_TYPE) as [string, ...string[]]),
  condition: z.enum(Object.values(VEHICLE_CONDITION) as [string, ...string[]]),
  mileage: z.coerce.number().int().min(0),
  mileageUnit: z.enum(Object.values(MILEAGE_UNIT) as [string, ...string[]]),
  description: z.string().optional().or(z.literal('')),
  purchasePrice: z.coerce.number().min(0),
  askingPrice: z.coerce.number().min(0),
  currency: z.string().length(3).default('USD'),
  isPublished: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

export function AdminVehicleFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading } = useStaffVehicle(id);
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle(id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currency: 'USD',
      mileageUnit: 'KM',
      bodyType: 'SEDAN',
      fuelType: 'PETROL',
      transmission: 'AUTOMATIC',
      driveType: 'FWD',
      condition: 'USED',
      isPublished: false,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        vin: existing.vin ?? '',
        engineNumber: existing.engineNumber ?? '',
        make: existing.make,
        model: existing.model,
        year: existing.year,
        trim: existing.trim ?? '',
        color: existing.color ?? '',
        bodyType: existing.bodyType,
        fuelType: existing.fuelType,
        transmission: existing.transmission,
        driveType: existing.driveType,
        condition: existing.condition,
        mileage: existing.mileage,
        mileageUnit: existing.mileageUnit,
        description: existing.description ?? '',
        purchasePrice: existing.purchasePrice,
        askingPrice: existing.askingPrice,
        currency: existing.currency,
        isPublished: existing.isPublished,
      });
    }
  }, [existing, reset]);

  if (isEdit && isLoading) return <FullPageSpinner />;

 

const onSubmit = (values: FormValues) => {
  const payload = {
    vin: values.vin || null,
    engineNumber: values.engineNumber || null,
    make: values.make,
    model: values.model,
    year: values.year,
    trim: values.trim || null,
    color: values.color || null,
    bodyType: values.bodyType as BodyType,
    fuelType: values.fuelType as FuelType,
    transmission: values.transmission as Transmission,
    driveType: values.driveType as DriveType,
    condition: values.condition as VehicleCondition,
    mileage: values.mileage,
    mileageUnit: values.mileageUnit as MileageUnit,
    description: values.description || null,
    purchasePrice: values.purchasePrice,
    askingPrice: values.askingPrice,
    currency: values.currency,
    isPublished: values.isPublished,
  };

  if (isEdit && id) {
    updateMutation.mutate(payload, {
      onSuccess: () => navigate(`/admin/vehicles/${id}`),
    });
  } else {
    createMutation.mutate(payload, {
      onSuccess: (v) => navigate(`/admin/vehicles/${v.id}`),
    });
  }
};

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title={isEdit ? 'Edit vehicle' : 'New vehicle'}
        description={
          isEdit
            ? `Update details for ${existing?.stockNumber}`
            : 'Add a new vehicle to your inventory'
        }
      />

      {!isEdit && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <strong>Tip:</strong> Save the vehicle first, then add images and
          video from its detail page.
        </div>
      )}



      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Identification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identification</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" {...register('vin')} placeholder="Optional" />
              {errors.vin && <p className="text-xs text-destructive">{errors.vin.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="engineNumber">Engine number</Label>
              <Input
                id="engineNumber"
                {...register('engineNumber')}
                placeholder="Optional"
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Make" error={errors.make?.message}>
              <Input {...register('make')} placeholder="Toyota" />
            </Field>
            <Field label="Model" error={errors.model?.message}>
              <Input {...register('model')} placeholder="Corolla" />
            </Field>
            <Field label="Year" error={errors.year?.message}>
              <Input type="number" {...register('year')} />
            </Field>
            <Field label="Trim" error={errors.trim?.message}>
              <Input {...register('trim')} placeholder="LE" />
            </Field>
            <Field label="Color" error={errors.color?.message}>
              <Input {...register('color')} placeholder="White" />
            </Field>
            <Field label="Mileage" error={errors.mileage?.message}>
              <Input type="number" {...register('mileage')} />
            </Field>
            <Field label="Mileage Unit">
              <Select
                value={watch('mileageUnit')}
                onValueChange={(v) => setValue('mileageUnit', v as never)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.values(MILEAGE_UNIT).map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        {/* Specs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <EnumSelect name="bodyType" label="Body type" values={Object.values(BODY_TYPE)} register={register} setValue={setValue} watch={watch} />
            <EnumSelect name="fuelType" label="Fuel type" values={Object.values(FUEL_TYPE)} register={register} setValue={setValue} watch={watch} />
            <EnumSelect name="transmission" label="Transmission" values={Object.values(TRANSMISSION)} register={register} setValue={setValue} watch={watch} />
            <EnumSelect name="driveType" label="Drive type" values={Object.values(DRIVE_TYPE)} register={register} setValue={setValue} watch={watch} />
            <EnumSelect name="condition" label="Condition" values={Object.values(VEHICLE_CONDITION)} register={register} setValue={setValue} watch={watch} />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Field label="Purchase price" error={errors.purchasePrice?.message}>
              <Input type="number" step="0.01" {...register('purchasePrice')} />
            </Field>
            <Field label="Asking price" error={errors.askingPrice?.message}>
              <Input type="number" step="0.01" {...register('askingPrice')} />
            </Field>
            <Field label="Currency">
              <Input {...register('currency')} maxLength={3} />
            </Field>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea rows={5} {...register('description')} />
          </CardContent>
        </Card>

        {/* Publish toggle */}
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-4">
          <input type="checkbox" {...register('isPublished')} className="h-4 w-4" />
          <div>
            <p className="font-medium">Publish immediately</p>
            <p className="text-xs text-muted-foreground">
              When enabled, this vehicle is visible in the public storefront.
            </p>
          </div>
        </label>

        {/* Media management — only when editing an existing vehicle */}
        {isEdit && id && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Images & Video</h2>
              <span className="text-xs text-muted-foreground">
                Add or manage media for this vehicle
              </span>
            </div>
            <VehicleMediaSection vehicleId={id} />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Save changes' : 'Create vehicle'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function EnumSelect({
  name,
  label,
  values,
  setValue,
  watch,
}: {
  name: keyof FormValues;
  label: string;
  values: readonly string[];
  register: unknown;
  setValue: (n: never, v: never) => void;
  watch: (n: never) => string;
}) {
  const value = watch(name as never);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(v) => setValue(name as never, v as never)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {values.map((v) => (
            <SelectItem key={v} value={v}>
              {v.split('_').map((s) => s[0] + s.slice(1).toLowerCase()).join(' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}