import PlusCircleIcon from '@shared/icons/plusCircle';

import { createBlobFromFile } from '@utils/createBlobFromFile';

import { open } from '@tauri-apps/api/dialog';
import { listen } from '@tauri-apps/api/event';
import { Body, fetch } from '@tauri-apps/api/http';
import { useCallback, useEffect, useState } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';

export function ImageUploader() {
  const editor = useSlateStatic();
  const [loading, setLoading] = useState(false);

  const insertImage = (editor, url) => {
    const image = { type: 'image', url, children: [{ text: url }] };
    Transforms.insertNodes(editor, image);
  };

  const uploadToVoidCat = useCallback(
    async (filepath) => {
      const filename = filepath.split('/').pop();
      const file = await createBlobFromFile(filepath);
      const buf = await file.arrayBuffer();

      try {
        const res: { data: { file: { id: string } } } = await fetch('https://void.cat/upload?cli=false', {
          method: 'POST',
          timeout: 5,
          headers: {
            accept: '*/*',
            'Content-Type': 'application/octet-stream',
            'V-Filename': filename,
            'V-Description': 'Uploaded from https://lume.nu',
            'V-Strip-Metadata': 'true',
          },
          body: Body.bytes(buf),
        });
        const image = 'https://void.cat/d/' + res.data.file.id + '.webp';
        // update parent state
        insertImage(editor, image);
        // reset loading state
        setLoading(false);
      } catch (error) {
        // reset loading state
        setLoading(false);
        // handle error
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log('There was a SyntaxError', error);
        } else {
          console.log('There was an error', error);
        }
      }
    },
    [editor]
  );

  const openFileDialog = async () => {
    const selected: any = await open({
      multiple: false,
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpeg', 'jpg', 'gif'],
        },
      ],
    });
    if (Array.isArray(selected)) {
      // user selected multiple files
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      setLoading(true);
      // upload file
      uploadToVoidCat(selected);
    }
  };

  useEffect(() => {
    async function initFileDrop() {
      const unlisten = await listen('tauri://file-drop', (event) => {
        // set loading state
        setLoading(true);
        // upload file
        uploadToVoidCat(event.payload[0]);
      });

      return () => {
        unlisten();
      };
    }

    initFileDrop();
  }, [uploadToVoidCat]);

  return (
    <button
      type="button"
      autoFocus={false}
      onClick={() => openFileDialog()}
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-zinc-800"
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin text-black dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <PlusCircleIcon width={20} height={20} className="text-zinc-500" />
      )}
    </button>
  );
}
