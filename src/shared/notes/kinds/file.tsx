import { NDKEvent } from '@nostr-dev-kit/ndk';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
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
          crossorigin=""
        >
          <MediaProvider />
        </MediaPlayer>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <Link
        to={url}
        target="_blank"
        className="break-all font-normal text-fuchsia-500 hover:text-fuchsia-600"
      >
        {url}
      </Link>
    </div>
  );
}
