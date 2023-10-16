import { Dispatch, SetStateAction, useState } from 'react';

import { LoaderIcon, PlusIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function BannerUploader({
  setBanner,
}: {
  setBanner: Dispatch<SetStateAction<string>>;
}) {
  const { upload } = useNostr();
  const [loading, setLoading] = useState(false);

  const uploadBanner = async () => {
    setLoading(true);
    const image = await upload(null);
    if (image.url) {
      setBanner(image.url);
    }
    setLoading(false);
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
