import { message, open } from '@tauri-apps/plugin-dialog';
import { readBinaryFile } from '@tauri-apps/plugin-fs';
import { fetch } from '@tauri-apps/plugin-http';
import { Dispatch, SetStateAction, useState } from 'react';

import { LoaderIcon, PlusIcon } from '@shared/icons';

export function BannerUploader({
  setBanner,
}: {
  setBanner: Dispatch<SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);

  const uploadBanner = async () => {
    try {
      // start loading
      setLoading(true);

      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Image',
            extensions: ['png', 'jpeg', 'jpg', 'gif'],
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
        const content = json.data[0];

        setBanner(content.url);

        // stop loading
        setLoading(false);
      }
    } catch (e) {
      // stop loading
      setLoading(false);
      await message(`Upload failed, error: ${e}`, { title: 'Lume', type: 'error' });
    }
  };

  return (
    <button
      type="button"
      onClick={() => uploadBanner()}
      className="inline-flex h-full w-full flex-col items-center justify-center"
    >
      {loading ? (
        <LoaderIcon className="h-6 w-6 animate-spin text-neutral-900 dark:text-neutral-100" />
      ) : (
        <PlusIcon className="h-6 w-6 text-neutral-900 dark:text-neutral-100" />
      )}
      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        Add cover
      </p>
    </button>
  );
}
