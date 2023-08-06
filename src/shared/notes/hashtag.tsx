import { useBlocks } from '@stores/blocks';
import { BLOCK_KINDS } from '@stores/constants';

export function Hashtag({ tag }: { tag: string }) {
  const setBlock = useBlocks((state) => state.setBlock);

  return (
    <button
      type="button"
      onClick={() =>
        setBlock({
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
