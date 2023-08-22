import { useStorage } from '@libs/storage/provider';

import { WidgetKinds, useWidgets } from '@stores/widgets';

export function Hashtag({ tag }: { tag: string }) {
  const { db } = useStorage();
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <button
      type="button"
      onClick={() =>
        setWidget(db, {
          kind: WidgetKinds.hashtag,
          title: tag,
          content: tag.replace('#', ''),
        })
      }
      className="break-words font-normal text-orange-400 no-underline hover:text-orange-500"
    >
      {tag}
    </button>
  );
}
