import { Dispatch, SetStateAction, useState } from 'react';

import { LoaderIcon, PlusIcon } from '@shared/icons';

import { useImageUploader } from '@utils/hooks/useUploader';

export function BannerUploader({
  setBanner,
}: {
  setBanner: Dispatch<
    SetStateAction<{ url: undefined | string; error?: undefined | string }>
  >;
}) {
  const upload = useImageUploader();
  const [loading, setLoading] = useState(false);

  const uploadBanner = async () => {
    setLoading(true);
    const image = await upload(null);
    if (image.url) {
      setBanner(image);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={() => uploadBanner()}
      className="inline-flex h-full w-full items-center justify-center bg-black/40 hover:bg-black/50"
    >
      {loading ? (
        <LoaderIcon className="h-8 w-8 animate-spin text-white" />
      ) : (
        <PlusIcon className="h-8 w-8 text-white" />
      )}
    </button>
  );
}
