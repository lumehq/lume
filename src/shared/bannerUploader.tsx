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
      className="inline-flex h-full w-full flex-col items-center justify-center gap-1 bg-black/40 hover:bg-black/50"
    >
      {loading ? (
        <LoaderIcon className="h-6 w-6 animate-spin text-white" />
      ) : (
        <PlusIcon className="h-6 w-6 text-white" />
      )}
      <p className="text-sm font-medium text-white/70">Add a banner image</p>
    </button>
  );
}
