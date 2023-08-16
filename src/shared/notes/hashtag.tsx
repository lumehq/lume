import { widgetKinds } from '@stores/constants';
import { useWidgets } from '@stores/widgets';

export function Hashtag({ tag }: { tag: string }) {
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <button
      type="button"
      onClick={() =>
        setWidget({
          kind: widgetKinds.hashtag,
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
