import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { VehicleImage } from '../api/vehicles.types';

interface VehicleGalleryProps {
  images: VehicleImage[];
}

export function VehicleGallery({ images }: VehicleGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [index, setIndex] = useState(() =>
    Math.max(0, sorted.findIndex((i) => i.isPrimary))
  );

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg border bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8" />
          <span className="text-sm">No images</span>
        </div>
      </div>
    );
  }

  const current = sorted[index];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-lg border bg-muted">
        <img
          src={current.url}
          alt={current.altText ?? 'Vehicle'}
          className="h-full w-full object-cover"
        />

        {sorted.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setIndex((i) => (i - 1 + sorted.length) % sorted.length)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setIndex((i) => (i + 1) % sorted.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
              {index + 1} / {sorted.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIndex(i)}
              className={cn(
                'aspect-square overflow-hidden rounded-md border-2 transition-colors',
                i === index ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <img
                src={img.url}
                alt={img.altText ?? ''}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}