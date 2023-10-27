import { message, open } from '@tauri-apps/plugin-dialog';
import { readBinaryFile } from '@tauri-apps/plugin-fs';
import { fetch } from '@tauri-apps/plugin-http';
import { Dispatch, SetStateAction, useState } from 'react';

import { LoaderIcon, PlusIcon } from '@shared/icons';

export function AvatarUploader({
  setPicture,
}: {
  setPicture: Dispatch<SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async () => {
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

        setPicture(content.url);

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
      onClick={() => uploadAvatar()}
      className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-100 px-1.5 py-1 text-sm font-medium text-blue-500 hover:border-blue-300 hover:bg-blue-200 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-500 dark:hover:border-blue-800 dark:hover:bg-blue-800"
    >
      {loading ? (
        <LoaderIcon className="h-4 w-4 animate-spin" />
      ) : (
        <PlusIcon className="h-4 w-4" />
      )}
      Change avatar
    </button>
  );
}
