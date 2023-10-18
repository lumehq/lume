import { useStorage } from '@libs/storage/provider';

import { WidgetKinds, useWidgets } from '@stores/widgets';

export function Hashtag({ tag }: { tag: string }) {
  const { db } = useStorage();
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <span
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
      className="cursor-default break-all text-blue-500 hover:text-blue-600"
    >
      {tag}
    </span>
  );
}
