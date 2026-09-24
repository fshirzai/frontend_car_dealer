import { useRef, useState } from 'react';
import { Upload, Loader2, X, ImageIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { useAppSettings } from '../context/SettingsContext';
import { useUploadLogo } from '../hooks/useUploadLogo';

interface LogoUploaderProps {
  /** Current saved URL (from settings). */
  value: string | null;
  /** Called after a successful upload OR when cleared. */
  onChange: (url: string | null) => void;
}

export function LogoUploader({ value, onChange }: LogoUploaderProps) {
  const { resolveAssetUrl } = useAppSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadLogo();
  const [dragging, setDragging] = useState(false);

  const previewUrl = resolveAssetUrl(value);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    const result = await upload.mutateAsync(file);
    onChange(result.url); // relative URL, resolved when displayed
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = ''; // allow re-selecting the same file
  };

  return (
    <div className="space-y-3">
      <Label>Logo</Label>

      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {previewUrl ? (
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border bg-muted">
              <img
                src={previewUrl}
                alt="Logo preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={upload.isPending}
              >
                {upload.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Replace
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onChange(null)}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              {upload.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {upload.isPending ? 'Uploading…' : 'Upload a logo'}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag and drop, or click to select
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                PNG, JPG, WEBP, SVG or ICO · up to 5 MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={upload.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select file
            </Button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
          className="hidden"
          onChange={onPick}
        />
      </div>
    </div>
  );
}