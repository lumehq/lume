import { useStorage } from '@libs/storage/provider';

import { WidgetKinds, useWidgets } from '@stores/widgets';

export function Hashtag({ tag }: { tag: string }) {
  const { db } = useStorage();
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() =>
        setWidget(db, {
          kind: WidgetKinds.global.hashtag,
          title: tag,
          content: tag.replace('#', ''),
        })
      }
      onKeyDown={() =>
        setWidget(db, {
          kind: WidgetKinds.global.hashtag,
          title: tag,
          content: tag.replace('#', ''),
        })
      }
      className="break-all text-fuchsia-400 hover:text-fuchsia-500"
    >
      {tag}
    </div>
  );
}
