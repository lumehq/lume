import { CancelIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';
import { useWidgets } from '@stores/widgets';

import { Widget } from '@utils/types';

export function ImageBlock({ params }: { params: Widget }) {
  const remove = useWidgets((state) => state.removeWidget);

  return (
    <div className="flex h-full w-[400px] shrink-0 flex-col justify-between">
      <div className="relative h-full w-full flex-1 overflow-hidden p-3">
        <div className="absolute left-0 top-3 h-16 w-full px-3">
          <div className="flex h-16 items-center justify-between overflow-hidden rounded-t-xl px-5">
            <h3 className="font-medium text-white drop-shadow-lg">{params.title}</h3>
            <button
              type="button"
              onClick={() => remove(params.id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/30 backdrop-blur-lg"
            >
              <CancelIcon width={16} height={16} className="text-white" />
            </button>
          </div>
        </div>
        <Image
          src={params.content}
          fallback={DEFAULT_AVATAR}
          alt={params.title}
          className="h-full w-full rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
