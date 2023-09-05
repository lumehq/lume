import { message } from '@tauri-apps/api/dialog';
import { Editor } from '@tiptap/react';
import { useState } from 'react';

import { MediaIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function MediaUploader({ editor }: { editor: Editor }) {
  const { upload } = useNostr();
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file?: string) => {
    try {
      // start loading
      setLoading(true);

      const image = await upload(file, true);
      if (image.url) {
        editor.commands.setImage({ src: image.url });
        editor.commands.createParagraphNear();

        // stop loading
        setLoading(false);
      }
    } catch (e) {
      // stop loading
      setLoading(false);
      await message('Upload failed', { title: 'Lume', type: 'error' });
    }
  };

  return (
    <button
      type="button"
      onClick={() => uploadImage()}
      className="ml-2 inline-flex h-10 w-max items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:backdrop-blur-xl"
    >
      <MediaIcon className="h-5 w-5 text-white/80" />
      {loading ? 'Uploading...' : 'Add media'}
    </button>
  );
}
