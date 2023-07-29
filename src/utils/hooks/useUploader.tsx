import { open } from '@tauri-apps/plugin-dialog';
import { Body, fetch } from '@tauri-apps/plugin-http';

import { createBlobFromFile } from '@utils/createBlobFromFile';

interface UploadResponse {
  fileID?: string;
  fileName?: string;
  imageUrl?: string;
  lightningDestination?: string;
  lightningPaymentLink?: string;
  message?: string;
  route?: string;
  status: number;
  success: boolean;
  url?: string;
  data?: {
    url?: string;
  };
}

export function useImageUploader() {
  const upload = async (file: null | string, nip94?: boolean) => {
    let filepath = file;

    if (!file) {
      const selected = await open({
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
        filepath = selected;
      }
    }

    const filename = filepath.split('/').pop();
    const filetype = 'image/' + filename.split('.').pop();

    const blob = await createBlobFromFile(filepath);
    const res = await fetch('https://nostrimg.com/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: Body.form({
        keys: filename,
        image: {
          file: blob,
          mime: filetype,
          fileName: filename,
        },
      }),
    });

    if (res.ok) {
      const data = res.data as UploadResponse;
      if (typeof data?.imageUrl === 'string' && data.success) {
        if (nip94) {
          console.log('todo');
        }
        return {
          url: new URL(data.imageUrl).toString(),
        };
      }
    }

    return {
      error: 'Upload failed',
    };
  };

  return upload;
}
