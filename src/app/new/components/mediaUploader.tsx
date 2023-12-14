import { message } from '@tauri-apps/plugin-dialog';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { useArk } from '@libs/ark';
import { MediaIcon } from '@shared/icons';

export function MediaUploader({ editor }: { editor: Editor }) {
  const ark = useArk();
  const [loading, setLoading] = useState(false);

  const uploadToNostrBuild = async () => {
    try {
      // start loading
      setLoading(true);

      const image = await ark.upload({
        fileExts: ['mp4', 'mp3', 'webm', 'mkv', 'avi', 'mov'],
      });

      if (image) {
        editor.commands.setImage({ src: image });
        editor.commands.createParagraphNear();

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
