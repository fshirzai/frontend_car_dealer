import { useRef, useState } from 'react';
import { Upload, Loader2, FileText, X, ExternalLink } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { useUploadDocument } from '@/modules/settings/hooks/useUploadLogo';

interface DocumentUploaderProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  className?: string;
}

const shortName = (url: string) => {
  try {
    const u = new URL(url, window.location.origin);
    return decodeURIComponent(u.pathname.split('/').pop() ?? url);
  } catch {
    return url;
  }
};

export function DocumentUploader({
  value,
  onChange,
  className,
}: DocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const upload = useUploadDocument();

  const handleFile = async (file: File) => {
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
      {/* Current document preview */}
      {value && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
          <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-sm hover:underline"
          >
            {shortName(value)}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            asChild
          >
            <a href={value} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onChange(null)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Upload area */}
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
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {upload.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <p className="mt-2 text-sm font-medium">
          {upload.isPending
            ? 'Uploading…'
            : value
            ? 'Replace document'
            : 'Upload a document'}
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, image, or Office file · up to 20 MB
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
          accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={onPick}
        />
      </div>

      {/* OR paste URL */}
      <div className="space-y-2">
        <Input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="…or paste a URL"
        />
      </div>
    </div>
  );
}