import { BLOCK_KINDS } from '@stores/constants';

import { useBlock } from '@utils/hooks/useBlock';

export function Hashtag({ tag }: { tag: string }) {
  const { add } = useBlock();

  return (
    <button
      type="button"
      onClick={() =>
        add.mutate({
          kind: BLOCK_KINDS.hashtag,
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
