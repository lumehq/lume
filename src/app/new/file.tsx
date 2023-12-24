import { message, open } from '@tauri-apps/plugin-dialog';
import { readBinaryFile } from '@tauri-apps/plugin-fs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useArk } from '@libs/ark';
import { LoaderIcon } from '@shared/icons';

export function NewFileScreen() {
  const ark = useArk();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isPublish, setIsPublish] = useState(false);
  const [metadata, setMetadata] = useState<string[][] | null>(null);
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
      if (!ark.ndk.signer) return navigate('/new/privkey');

      setIsPublish(true);

      const publish = await ark.createEvent({
        kind: 1063,
        tags: metadata,
        content: caption,
      });

      if (publish) {
        toast.success(`Broadcasted to ${publish.seens.length} relays successfully.`);
        setMetadata(null);
        setIsPublish(false);
      }
    } catch (e) {
      setIsPublish(false);
      toast.error(e);
    }
  };

  return (
    <div className="h-full">
      <div className="flex h-96 gap-4 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
        <button
          type="button"
          onClick={uploadFile}
          className="flex h-full flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-2 hover:border-blue-500 hover:text-blue-500 dark:border-neutral-800 dark:bg-neutral-950"
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
                className="aspect-square h-full w-full rounded-lg object-cover shadow-lg"
              />
            </div>
          )}
        </button>
        {metadata ? (
          <div className="flex h-full flex-1 flex-col justify-between">
            <div className="flex flex-col gap-2 py-2">
              {metadata.map((item, index) => (
                <div key={index} className="flex min-w-0 gap-2">
                  <h5 className="w-24 shrink-0 truncate font-semibold capitalize text-neutral-600 dark:text-neutral-400">
                    {item[0]}
                  </h5>
                  <p className="w-72 truncate">{item[1]}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
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
                className="h-11 w-full rounded-lg bg-neutral-200 px-3 placeholder:text-neutral-500 dark:bg-neutral-900 dark:placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!metadata}
                className="inline-flex h-9 w-full shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {isPublish ? <LoaderIcon className="h-4 w-4 animate-spin" /> : 'Share'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
