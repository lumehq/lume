import { NDKEvent } from '@nostr-dev-kit/ndk';
import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from 'media-chrome/dist/react';
import { memo } from 'react';
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
        <MediaController key={url} className="aspect-video overflow-hidden rounded-lg">
          <video
            slot="media"
            src={url}
            poster={`https://thumbnail.video/api/get?url=${url}&seconds=1`}
            preload="auto"
            muted
            crossOrigin=""
          />
          <MediaControlBar>
            <MediaPlayButton></MediaPlayButton>
            <MediaSeekBackwardButton></MediaSeekBackwardButton>
            <MediaSeekForwardButton></MediaSeekForwardButton>
            <MediaTimeRange></MediaTimeRange>
            <MediaTimeDisplay showDuration></MediaTimeDisplay>
            <MediaMuteButton></MediaMuteButton>
            <MediaVolumeRange></MediaVolumeRange>
          </MediaControlBar>
        </MediaController>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <Link
        to={url}
        target="_blank"
        className="break-all font-normal text-blue-500 hover:text-blue-600"
      >
        {url}
      </Link>
    </div>
  );
}

export const MemoizedFileNote = memo(FileNote);
