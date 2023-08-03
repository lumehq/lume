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
            className="group inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
          >
            {loading ? (
              <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-white" />
            ) : (
              <MediaIcon className="h-5 w-5 text-white/50 group-hover:text-white" />
            )}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="-left-10 select-none rounded-md bg-black px-3.5 py-1.5 text-sm leading-none text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            Upload media
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
