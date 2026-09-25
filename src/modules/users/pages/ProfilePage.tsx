import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, KeyRound, User as UserIcon } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { FullPageSpinner } from '@/shared/components/common/Spinner';
import { getInitials, formatDate } from '@/shared/lib/utils';
import {
  useMe,
  useUpdateMe,
  useChangePassword,
} from '../hooks/useUsers';

/* -------------------- Profile form -------------------- */

const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(120),
  phone: z.string().max(30).optional().or(z.literal('')),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { data: me, isLoading } = useMe();
  const update = useUpdateMe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '', image: '' },
  });

  useEffect(() => {
    if (me) {
      reset({
        name: me.name,
        phone: me.phone ?? '',
        image: me.image ?? '',
      });
    }
  }, [me, reset]);

  if (isLoading) return <FullPageSpinner />;
  if (!me) return null;

  const onSubmit = (values: ProfileFormValues) => {
    update.mutate({
      name: values.name.trim(),
      phone: values.phone?.trim() || null,
      image: values.image?.trim() || null,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your account information"
      />

      {/* Identity card */}
      <Card>
        <CardContent className="flex flex-col items-start gap-4 pt-6 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16">
            {me.image && <AvatarImage src={me.image} alt={me.name} />}
            <AvatarFallback className="text-lg">
              {getInitials(me.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{me.name}</h2>
              <Badge variant="outline">{me.role}</Badge>
              {me.emailVerifiedAt ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <Badge variant="warning">Unverified</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{me.email}</p>
            <p className="text-xs text-muted-foreground">
              Member since {formatDate(me.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Edit profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserIcon className="h-4 w-4" />
              Personal information
            </CardTitle>
            <CardDescription>Update your name, phone, and photo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} placeholder="Optional" />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile image URL</Label>
                <Input
                  id="image"
                  {...register('image')}
                  placeholder="https://example.com/photo.jpg"
                />
                {errors.image && (
                  <p className="text-xs text-destructive">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={!isDirty || update.isPending}>
                  {update.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change password */}
        <ChangePasswordCard />
      </div>
    </div>
  );
}

/* -------------------- Change password -------------------- */

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/\d/, 'Must include a number'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

function ChangePasswordCard() {
  const change = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (values: PasswordFormValues) => {
    change.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      { onSuccess: () => reset() }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <KeyRound className="h-4 w-4" />
          Change password
        </CardTitle>
        <CardDescription>
          Choose a strong password with 8+ characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="text-xs text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={change.isPending}>
              {change.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Change password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}