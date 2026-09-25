import { useState } from 'react';
import {
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { ImageUploader } from '@/shared/components/common/ImageUploader';
import { useAppSettings } from '@/modules/settings/context/SettingsContext';
import {
  useVehicleImages,
  useAddVehicleImage,
  useAddVehicleImagesBulk,
  useSetPrimaryImage,
  useDeleteVehicleImage,
  useReorderVehicleImages,
} from '../hooks/useVehicles';

interface VehicleImageManagerProps {
  vehicleId: string;
}

export function VehicleImageManager({ vehicleId }: VehicleImageManagerProps) {
  const { resolveAssetUrl } = useAppSettings();

  const { data: images = [], isLoading } = useVehicleImages(vehicleId);
  const addImage = useAddVehicleImage(vehicleId);
  const addBulk = useAddVehicleImagesBulk(vehicleId);
  const setPrimary = useSetPrimaryImage();
  const deleteImage = useDeleteVehicleImage();
  const reorder = useReorderVehicleImages(vehicleId);

  const [altText, setAltText] = useState('');

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleUpload = async (urls: string[]) => {
    if (urls.length === 0) return;

    if (urls.length === 1) {
      addImage.mutate(
        { url: urls[0], altText: altText.trim() || null },
        { onSuccess: () => setAltText('') }
      );
    } else {
      addBulk.mutate(urls.map((url) => ({ url })));
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    reorder.mutate(next.map((i) => i.id));
  };

  const busy =
    addImage.isPending ||
    addBulk.isPending ||
    setPrimary.isPending ||
    deleteImage.isPending ||
    reorder.isPending;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">
          Images
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({sorted.length})
          </span>
        </CardTitle>
        {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Upload area */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="image-alt">Alt text (optional, for accessibility)</Label>
            <Input
              id="image-alt"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Front view"
            />
          </div>

          <ImageUploader
            onUploaded={handleUpload}
            multiple
            className="min-h-[160px]"
          />
          <p className="text-xs text-muted-foreground">
            Drop up to 10 images at once. The first uploaded image becomes the
            primary automatically.
          </p>
        </div>

        {/* Gallery */}
        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            No images yet. Upload the first one above.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sorted.map((img, index) => (
              <div
                key={img.id}
                className={cn(
                  'group relative overflow-hidden rounded-lg border bg-muted',
                  img.isPrimary && 'ring-2 ring-primary'
                )}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={resolveAssetUrl(img.url) ?? img.url}
                    alt={img.altText ?? ''}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                {img.isPrimary && (
                  <div className="absolute left-2 top-2">
                    <Badge variant="info" className="gap-1">
                      <Star className="h-3 w-3" />
                      Primary
                    </Badge>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    title="Move left"
                    disabled={index === 0 || reorder.isPending}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>

                  {!img.isPrimary && (
                    <Button
                      variant="secondary"
                      size="icon"
                      title="Set as primary"
                      disabled={setPrimary.isPending}
                      onClick={() => setPrimary.mutate(img.id)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="icon"
                    title="Move right"
                    disabled={index === sorted.length - 1 || reorder.isPending}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    title="Delete"
                    disabled={deleteImage.isPending}
                    onClick={() => {
                      if (confirm('Delete this image?')) {
                        deleteImage.mutate(img.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                  #{img.sortOrder}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}