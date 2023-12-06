import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';

export function VideoPreview({ url }: { url: string }) {
  return (
    <MediaPlayer
      src={url}
      className="my-2 w-full overflow-hidden rounded-lg"
      aspectRatio="16/9"
      load="visible"
    >
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
