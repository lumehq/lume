import { Dispatch, SetStateAction, useState } from 'react';

import { LoaderIcon, PlusIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function AvatarUploader({
  setPicture,
}: {
  setPicture: Dispatch<SetStateAction<string>>;
}) {
  const { upload } = useNostr();
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async () => {
    setLoading(true);
    const image = await upload(null);
    if (image.url) {
      setPicture(image.url);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={() => uploadAvatar()}
      className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-100 px-1.5 py-1 text-sm font-medium text-blue-500 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-500 dark:hover:bg-blue-800"
    >
      {loading ? (
        <LoaderIcon className="h-4 w-4 animate-spin" />
      ) : (
        <PlusIcon className="h-4 w-4" />
      )}
      Change avatar
    </button>
  );
}
