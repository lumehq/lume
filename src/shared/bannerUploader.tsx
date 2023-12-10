import { message } from '@tauri-apps/plugin-dialog';
import { Dispatch, SetStateAction, useState } from 'react';

import { useArk } from '@libs/ark';

import { LoaderIcon, PlusIcon } from '@shared/icons';

export function BannerUploader({
  setBanner,
}: {
  setBanner: Dispatch<SetStateAction<string>>;
}) {
  const { ark } = useArk();
  const [loading, setLoading] = useState(false);

  const uploadBanner = async () => {
    try {
      // start loading
      setLoading(true);

      const image = await ark.upload({});

      if (image) {
        setBanner(image);
        setLoading(false);
      }

      return;
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
