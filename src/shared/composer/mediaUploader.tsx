import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { message } from '@tauri-apps/plugin-dialog';
import { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';

import { MediaIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function MediaUploader({ editor }: { editor: Editor }) {
  const { upload } = useNostr();
  const [loading, setLoading] = useState(false);

  const uploadToNostrBuild = async (file?: string) => {
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
      await message(`Upload failed, error: ${e}`, { title: 'Lume', type: 'error' });
    }
  };

  useEffect(() => {
    let unlisten: UnlistenFn;

    async function listenDnD() {
      unlisten = await listen('tauri://file-drop', (event) => {
        uploadToNostrBuild(event.payload[0]);
      });
    }

    // start listen drag and drop event
    listenDnD();

    // clean up
    return () => {
      unlisten();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => uploadToNostrBuild()}
      className="ml-2 inline-flex h-10 w-max items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
    >
      <MediaIcon className="h-5 w-5" />
      {loading ? 'Uploading...' : 'Add media'}
    </button>
  );
}
