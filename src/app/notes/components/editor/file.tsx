import { NDKEvent } from '@nostr-dev-kit/ndk';
import { message, open } from '@tauri-apps/plugin-dialog';
import { readBinaryFile } from '@tauri-apps/plugin-fs';
import { useState } from 'react';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';

import { LoaderIcon } from '@shared/icons';

export function FileEditor() {
  const { ndk } = useNDK();

  const [loading, setLoading] = useState(false);
  const [isPublish, setIsPublish] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [caption, setCaption] = useState('');

  const uploadFile = async () => {
    try {
      setLoading(true);

      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Media',
            extensions: [
              'png',
              'jpeg',
              'jpg',
              'gif',
              'mp4',
              'mp3',
              'webm',
              'mkv',
              'avi',
              'mov',
            ],
          },
        ],
      });

      if (!selected) {
        setLoading(false);
        return;
      }

      const file = await readBinaryFile(selected.path);
      const blob = new Blob([file]);

      const data = new FormData();
      data.append('fileToUpload', blob);
      data.append('submit', 'Upload Image');

      const res = await fetch('https://nostr.build/api/v2/upload/files', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data[0];

        setMetadata([
          ['url', data.url],
          ['m', data.mime ?? 'application/octet-stream'],
          ['x', data.sha256 ?? ''],
          ['size', data.size.toString() ?? '0'],
          ['dim', `${data.dimensions.width}x${data.dimensions.height}` ?? '0'],
          ['blurhash', data.blurhash ?? ''],
          ['thumb', data.thumbnail ?? ''],
        ]);

        // stop loading
        setLoading(false);
      }
    } catch (e) {
      // stop loading
      setLoading(false);
      await message(`Upload failed, error: ${e}`, { title: 'Lume', type: 'error' });
    }
  };

  const submit = async () => {
    try {
      setIsPublish(true);

      const event = new NDKEvent(ndk);
      event.content = caption;
      event.kind = 1063;
      event.tags = metadata;

      const publishedRelays = await event.publish();
      if (publishedRelays) {
        setMetadata(null);
        setIsPublish(false);
        toast.success(`Broadcasted to ${publishedRelays.size} relays successfully.`);
      }
    } catch (e) {
      setIsPublish(false);
      toast.error(e);
    }
  };

  return (
    <div className="h-full">
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={uploadFile}
          className="flex h-72 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-100 hover:border-blue-500 hover:text-blue-500 dark:border-neutral-800 dark:bg-neutral-900"
        >
          {loading ? (
            <LoaderIcon className="h-5 w-5 animate-spin text-neutral-900 dark:text-neutral-100" />
          ) : !metadata ? (
            <div className="flex flex-col text-center">
              <h5 className="text-lg font-semibold">
                Click or drag a file to this area to upload
              </h5>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Supports: jpg, png, webp, gif, mov, mp4 or mp3
              </p>
            </div>
          ) : (
            <div>
              <img
                src={metadata[0][1]}
                alt={metadata[1][1]}
                className="h-56 w-56 rounded-lg object-cover shadow-lg"
              />
            </div>
          )}
        </button>
        <div className="mx-auto w-full max-w-sm">
          <div className="inline-flex w-full items-center gap-2">
            <input
              name="caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder="Caption (Optional)..."
              className="h-11 flex-1 rounded-lg bg-neutral-100 px-3 placeholder:text-neutral-500 dark:bg-neutral-900 dark:placeholder:text-neutral-400"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!metadata}
              className="inline-flex h-11 w-20 shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isPublish ? <LoaderIcon className="h-4 w-4 animate-spin" /> : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
