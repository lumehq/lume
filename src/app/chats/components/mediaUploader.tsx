import * as Tooltip from '@radix-ui/react-tooltip';
import { Dispatch, SetStateAction, useState } from 'react';

import { LoaderIcon, MediaIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function MediaUploader({
  setState,
}: {
  setState: Dispatch<SetStateAction<string>>;
}) {
  const { upload } = useNostr();
  const [loading, setLoading] = useState(false);

  const uploadMedia = async () => {
    setLoading(true);
    const image = await upload(null);
    if (image.url) {
      setState((prev: string) => `${prev}\n${image.url}`);
    }
    setLoading(false);
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={() => uploadMedia()}
            className="group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-300 text-zinc-500 hover:bg-zinc-400 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
          >
            {loading ? (
              <LoaderIcon className="h-4 w-4 animate-spin" />
            ) : (
              <MediaIcon className="h-4 w-4" />
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
