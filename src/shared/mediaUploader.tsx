import * as Tooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';

import { LoaderIcon, MediaIcon } from '@shared/icons';

import { useImageUploader } from '@utils/hooks/useUploader';

export function MediaUploader({ setState }: { setState: any }) {
  const upload = useImageUploader();
  const [loading, setLoading] = useState(false);

  const uploadMedia = async () => {
    const image = await upload(null);
    if (image.url) {
      // update state
      setState((prev: string) => `${prev}\n${image.url}`);
      // stop loading
      setLoading(false);
    }
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={() => uploadMedia()}
            className="group inline-flex h-6 w-6 items-center justify-center rounded bg-zinc-700 hover:bg-zinc-600"
          >
            {loading ? (
              <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
            ) : (
              <MediaIcon
                width={14}
                height={14}
                className="text-zinc-400 group-hover:text-zinc-200"
              />
            )}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="-left-10 select-none rounded-md bg-zinc-800/80 px-3.5 py-1.5 text-sm leading-none text-zinc-100 backdrop-blur-lg will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            Upload media
            <Tooltip.Arrow className="fill-zinc-800/80 backdrop-blur-lg" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
