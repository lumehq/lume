import { message, open } from '@tauri-apps/plugin-dialog';
import { readBinaryFile } from '@tauri-apps/plugin-fs';
import { Editor } from '@tiptap/react';
import { useState } from 'react';

import { MediaIcon } from '@shared/icons';

export function MediaUploader({ editor }: { editor: Editor }) {
  const [loading, setLoading] = useState(false);

  const uploadToNostrBuild = async () => {
    try {
      // start loading
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
        const content = json.data[0];

        editor.commands.setImage({ src: content.url });
        editor.commands.createParagraphNear();

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
      onClick={() => uploadToNostrBuild()}
      className="inline-flex h-9 w-max items-center justify-center gap-1.5 rounded-lg bg-neutral-100 px-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      <MediaIcon className="h-5 w-5" />
      {loading ? 'Uploading...' : 'Add media'}
    </button>
  );
}
