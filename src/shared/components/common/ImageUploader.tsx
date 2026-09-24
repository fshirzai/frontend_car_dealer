import { useRef, useState } from 'react';
import { Upload, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useUploadImage, useUploadImages } from '@/modules/settings/hooks/useUploadLogo';

interface ImageUploaderProps {
  /** Called with the new image URL(s) after a successful upload. */
  onUploaded: (urls: string[]) => void;
  /** Allow multiple files at once. */
  multiple?: boolean;
  className?: string;
  compact?: boolean;
}

export function ImageUploader({
  onUploaded,
  multiple = false,
  className,
  compact = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const uploadSingle = useUploadImage();
  const uploadMulti = useUploadImages();

  const pending = uploadSingle.isPending || uploadMulti.isPending;

  const handleFiles = async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (images.length === 0) return;

    if (multiple) {
      const results = await uploadMulti.mutateAsync(images);
      onUploaded(results.map((r) => r.url));
    } else {
      const result = await uploadSingle.mutateAsync(images[0]);
      onUploaded([result.url]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    void handleFiles(files);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    void handleFiles(files);
    e.target.value = '';
  };

  if (compact) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {pending ? 'Uploading…' : 'Upload image'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={onPick}
        />
      </>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors',
        dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {pending ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium">
          {pending
            ? 'Uploading…'
            : multiple
            ? 'Upload images'
            : 'Upload an image'}
        </p>
        <p className="text-xs text-muted-foreground">
          Drag and drop, or click to select
        </p>
        <p className="text-[10px] text-muted-foreground">
          PNG, JPG, WEBP, GIF, SVG · up to 5 MB
          {multiple ? ' · max 10 files' : ''}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() => inputRef.current?.click()}
        disabled={pending}
      >
        <Upload className="mr-2 h-4 w-4" />
        Select {multiple ? 'files' : 'file'}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={onPick}
      />
    </div>
  );
}