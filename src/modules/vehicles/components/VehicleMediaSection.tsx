import { useState } from 'react';
import { Image as ImageIcon, Video } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { VehicleImageManager } from './VehicleImageManager';
import { VehicleVideoManager } from './VehicleVideoManager';

interface VehicleMediaSectionProps {
  vehicleId: string;
  initialTab?: 'images' | 'video';
}

export function VehicleMediaSection({
  vehicleId,
  initialTab = 'images',
}: VehicleMediaSectionProps) {
  const [tab, setTab] = useState<'images' | 'video'>(initialTab);

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as 'images' | 'video')}>
      <TabsList className="grid w-full max-w-xs grid-cols-2">
        <TabsTrigger value="images">
          <ImageIcon className="mr-2 h-4 w-4" />
          Images
        </TabsTrigger>
        <TabsTrigger value="video">
          <Video className="mr-2 h-4 w-4" />
          Video
        </TabsTrigger>
      </TabsList>

      <TabsContent value="images" className="mt-4">
        <VehicleImageManager vehicleId={vehicleId} />
      </TabsContent>

      <TabsContent value="video" className="mt-4">
        <VehicleVideoManager vehicleId={vehicleId} />
      </TabsContent>
    </Tabs>
  );
}