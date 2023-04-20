import { noteContentAtom } from '@stores/note';

import { createBlobFromFile } from '@utils/createBlobFromFile';

import { open } from '@tauri-apps/api/dialog';
import { Body, fetch } from '@tauri-apps/api/http';
import { Plus } from 'iconoir-react';
import { useSetAtom } from 'jotai';
import { useState } from 'react';

export const ImagePicker = () => {
  const [loading, setLoading] = useState(false);
  const setNoteContent = useSetAtom(noteContentAtom);

  const openFileDialog = async () => {
    const selected: any = await open({
      multiple: false,
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpeg', 'jpg', 'webp', 'avif'],
        },
      ],
    });
    if (Array.isArray(selected)) {
      // user selected multiple files
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      setLoading(true);

      const filename = selected.split('/').pop();
      const file = await createBlobFromFile(selected);
      const buf = await file.arrayBuffer();

      const res: { data: { file: { id: string } } } = await fetch('https://void.cat/upload?cli=false', {
        method: 'POST',
        timeout: 5,
        headers: {
          accept: '*/*',
          'Content-Type': 'application/octet-stream',
          'V-Filename': filename,
          'V-Description': 'Upload from https://lume.nu',
          'V-Strip-Metadata': 'true',
        },
        body: Body.bytes(buf),
      });
      const webpImage = 'https://void.cat/d/' + res.data.file.id + '.webp';

      setNoteContent((content) => content + ' ' + webpImage);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={() => openFileDialog()}
      className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700"
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
        <Plus width={16} height={16} className="text-zinc-400" />
      )}
    </button>
  );
};
