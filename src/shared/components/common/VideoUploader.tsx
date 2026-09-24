import { useRef, useState } from 'react';
import { Upload, Loader2, Video, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { useUploadVideo } from '@/modules/settings/hooks/useUploadLogo';

interface VideoUploaderProps {
  /** Current video URL (may be a YouTube link, Vimeo, or uploaded file). */
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function VideoUploader({
  value,
  onChange,
  className,
}: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const upload = useUploadVideo();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('video/')) return;
    const result = await upload.mutateAsync(file);
    onChange(result.url);
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
    e.target.value = '';
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* File drop zone */}
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-5 text-center transition-colors',
          dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          {upload.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Video className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <p className="mt-2 text-sm font-medium">
          {upload.isPending ? 'Uploading…' : 'Upload a video file'}
        </p>
        <p className="text-xs text-muted-foreground">
          MP4, WEBM, MOV · up to 100 MB
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
        >
          <Upload className="mr-2 h-4 w-4" />
          Select file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={onPick}
        />
      </div>

      {/* OR divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            or paste a URL
          </span>
        </div>
      </div>

      {/* URL input (YouTube / Vimeo / direct) */}
      <div className="space-y-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=... or /uploads/videos/..."
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onChange('')}
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        YouTube and Vimeo links are automatically embedded. Uploaded files play
        natively.
      </p>
    </div>
  );
}