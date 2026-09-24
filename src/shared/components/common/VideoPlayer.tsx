import { useState } from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { parseVideo } from '@/shared/lib/video';
import { cn } from '@/shared/lib/utils';

interface VideoPlayerProps {
  url: string;
  poster?: string | null;
  title?: string | null;
  className?: string;
  /** Set true for lazy thumbnail-before-play (better performance). */
  lazy?: boolean;
}

export function VideoPlayer({
  url,
  poster,
  title,
  className,
  lazy = false,
}: VideoPlayerProps) {
  const [activated, setActivated] = useState(!lazy);
  const parsed = parseVideo(url);

  if (!parsed) {
    return (
      <div
        className={cn(
          'flex aspect-video w-full items-center justify-center rounded-lg border bg-muted text-muted-foreground',
          className
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          <span className="text-sm">Invalid video URL</span>
        </div>
      </div>
    );
  }

  /* -------------------- Lazy thumbnail -------------------- */
  if (!activated) {
    return (
      <button
        type="button"
        onClick={() => setActivated(true)}
        className={cn(
          'group relative aspect-video w-full overflow-hidden rounded-lg border bg-black',
          className
        )}
      >
        {poster ? (
          <img
            src={poster}
            alt={title ?? 'Video thumbnail'}
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900" />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
            <Play className="ml-1 h-7 w-7 fill-black text-black" />
          </div>
        </div>

        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-left text-white">
            <p className="text-sm font-medium">{title}</p>
          </div>
        )}
      </button>
    );
  }

  /* -------------------- Embed (YouTube / Vimeo) -------------------- */
  if (parsed.isEmbed) {
    return (
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-lg border bg-black',
          className
        )}
      >
        <iframe
          src={parsed.embedUrl}
          title={title ?? 'Vehicle video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  /* -------------------- Direct <video> file -------------------- */
  return (
    <div
      className={cn(
        'aspect-video w-full overflow-hidden rounded-lg border bg-black',
        className
      )}
    >
      <video
        src={parsed.embedUrl}
        poster={poster ?? undefined}
        controls
        preload="metadata"
        playsInline
        className="h-full w-full"
      >
        Your browser doesn&apos;t support video playback.
      </video>
    </div>
  );
}