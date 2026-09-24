import { useEffect, useState } from 'react';
import { Loader2, Save, Trash2, Video } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { VideoPlayer } from '@/shared/components/common/VideoPlayer';
import { VideoUploader } from '@/shared/components/common/VideoUploader';
import { parseVideo } from '@/shared/lib/video';
import {
  useVehicleVideo,
  useUpsertVehicleVideo,
  useDeleteVehicleVideo,
} from '../hooks/useVehicles';

interface VehicleVideoManagerProps {
  vehicleId: string;
}

export function VehicleVideoManager({ vehicleId }: VehicleVideoManagerProps) {
  const { data: video, isLoading } = useVehicleVideo(vehicleId);
  const upsert = useUpsertVehicleVideo(vehicleId);
  const remove = useDeleteVehicleVideo(vehicleId);

  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (video) {
      setUrl(video.url);
      setThumbnailUrl(video.thumbnailUrl ?? '');
      setTitle(video.title ?? '');
    } else {
      setUrl('');
      setThumbnailUrl('');
      setTitle('');
    }
  }, [video]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = url.trim();
    if (!raw) return;

    const parsed = parseVideo(raw);
    const finalUrl = parsed?.isEmbed ? parsed.embedUrl : raw;

    upsert.mutate({
      url: finalUrl,
      thumbnailUrl: thumbnailUrl.trim() || null,
      title: title.trim() || null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="h-4 w-4" />
          Video
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <>
            {/* Preview */}
            {video && (
              <VideoPlayer
                url={video.url}
                poster={video.thumbnailUrl}
                title={video.title}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Video source *</Label>
                <VideoUploader value={url} onChange={setUrl} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="video-thumb">Thumbnail URL</Label>
                  <Input
                    id="video-thumb"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://cdn.example.com/thumb.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-title">Title</Label>
                  <Input
                    id="video-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Walk-around tour"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={upsert.isPending || !url.trim()}>
                  {upsert.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {video ? 'Update video' : 'Add video'}
                </Button>

                {video && (
                  <Button
                    type="button"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    disabled={remove.isPending}
                    onClick={() => {
                      if (confirm('Remove this video?')) {
                        remove.mutate(undefined, {
                          onSuccess: () => {
                            setUrl('');
                            setThumbnailUrl('');
                            setTitle('');
                          },
                        });
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}