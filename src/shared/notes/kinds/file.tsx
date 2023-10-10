import { NDKEvent } from '@nostr-dev-kit/ndk';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';
import { Link } from 'react-router-dom';

import { Image } from '@shared/image';

import { fileType } from '@utils/nip94';

export function FileNote(props: { event?: NDKEvent }) {
  const url = props.event.tags.find((el) => el[0] === 'url')[1];
  const type = fileType(url);

  if (type === 'image') {
    return (
      <div className="mb-2 mt-3">
        <Image
          src={url}
          alt={props.event.content}
          className="h-auto w-full rounded-lg object-cover"
        />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="mb-2 mt-3">
        <MediaPlayer
          key={url}
          src={url}
          poster={`https://thumbnail.video/api/get?url=${url}&seconds=1`}
          load="visible"
          aspectRatio="16/9"
          muted={true}
          crossorigin=""
          className="player"
        >
          <MediaProvider />
          <DefaultAudioLayout
            icons={defaultLayoutIcons}
            smallLayoutWhen="(width < 500) or (height < 380)"
            noModal={true}
          />
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            smallLayoutWhen="(width < 500) or (height < 380)"
            noModal={true}
          />
        </MediaPlayer>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <Link
        to={url}
        target="_blank"
        className="break-all font-normal text-blue-500 hover:text-blue-500"
      >
        {url}
      </Link>
    </div>
  );
}
