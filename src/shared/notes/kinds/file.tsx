import { NDKEvent } from '@nostr-dev-kit/ndk';
import { downloadDir } from '@tauri-apps/api/path';
import { download } from '@tauri-apps/plugin-upload';
import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeRange,
} from 'media-chrome/dist/react';
import { memo } from 'react';

import { DownloadIcon } from '@shared/icons';
import { LinkPreview } from '@shared/notes';

import { fileType } from '@utils/nip94';

export function FileNote(props: { event?: NDKEvent }) {
  const url = props.event.tags.find((el) => el[0] === 'url')[1];
  const type = fileType(url);

  const downloadImage = async (url: string) => {
    const downloadDirPath = await downloadDir();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return await download(url, downloadDirPath + `/${filename}`);
  };

  if (type === 'image') {
    return (
      <div key={url} className="group relative mt-2">
        <img
          src={url}
          alt={url}
          className="h-auto w-full rounded-lg border border-neutral-300 object-cover dark:border-neutral-700"
        />
        <button
          type="button"
          onClick={() => downloadImage(url)}
          className="absolute right-2 top-2 hidden h-10 w-10 items-center justify-center rounded-lg bg-black/50 backdrop-blur-xl group-hover:inline-flex hover:bg-blue-500"
        >
          <DownloadIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <MediaController
        key={url}
        className="mt-2 aspect-video w-full overflow-hidden rounded-lg"
      >
        <video slot="media" src={url} preload="metadata" muted />
        <MediaControlBar>
          <MediaPlayButton></MediaPlayButton>
          <MediaTimeRange></MediaTimeRange>
          <MediaMuteButton></MediaMuteButton>
          <MediaFullscreenButton></MediaFullscreenButton>
        </MediaControlBar>
      </MediaController>
    );
  }

  return (
    <div className="mt-2">
      <LinkPreview url={url} />
    </div>
  );
}

export const MemoizedFileNote = memo(FileNote);
