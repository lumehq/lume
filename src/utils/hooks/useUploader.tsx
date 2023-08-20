import { magnetDecode } from '@ctrl/magnet-link';
import { open } from '@tauri-apps/plugin-dialog';
import { VoidApi } from '@void-cat/api';

import { createBlobFromFile } from '@utils/createBlobFromFile';
import { useNostr } from '@utils/hooks/useNostr';

export function useImageUploader() {
  const { publish } = useNostr();

  const upload = async (file: null | string, nip94?: boolean) => {
    const voidcat = new VoidApi('https://void.cat');

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
        filepath = selected.path;
      }
    }

    const filename = filepath.split('/').pop();
    const filetype = filename.split('.').pop();

    const blob = await createBlobFromFile(filepath);
    const uploader = voidcat.getUploader(blob);

    // upload file
    const res = await uploader.upload();

    if (res.ok) {
      const url =
        res.file?.metadata?.url ?? `https://void.cat/d/${res.file?.id}.${filetype}`;

      if (nip94) {
        const tags = [
          ['url', url],
          ['x', res.file?.metadata?.digest ?? ''],
          ['m', res.file?.metadata?.mimeType ?? 'application/octet-stream'],
          ['size', res.file?.metadata?.size.toString() ?? '0'],
        ];

        if (res.file?.metadata?.magnetLink) {
          tags.push(['magnet', res.file.metadata.magnetLink]);
          const parsedMagnet = magnetDecode(res.file.metadata.magnetLink);
          if (parsedMagnet?.infoHash) {
            tags.push(['i', parsedMagnet?.infoHash]);
          }
        }

        await publish({ content: '', kind: 1063, tags: tags });
      }

      return {
        url: url,
      };
    }

    return {
      error: 'Upload failed',
    };
  };

  return upload;
}
