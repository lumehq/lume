import { NDKEvent } from '@nostr-dev-kit/ndk';
import ReactPlayer from 'react-player';

import { Image } from '@shared/image';

import { fileType } from '@utils/nip94';

export function FileNote({ event }: { event: NDKEvent }) {
  const url = event.tags.find((el) => el[0] === 'url')[1];
  const type = fileType(url);

  if (type === 'image') {
    return (
      <div className="mb-2 mt-3">
        <Image
          src={url}
          alt={event.content}
          className="h-auto w-full rounded-lg object-cover"
        />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="mb-2 mt-3">
        <ReactPlayer
          key={url}
          url={url}
          width="100%"
          height="auto"
          className="!h-auto overflow-hidden rounded-lg object-fill"
          controls={true}
          pip={true}
        />
      </div>
    );
  }

  return (
    <div className="mb-2 mt-3">
      <p>{url}</p>
    </div>
  );
}
