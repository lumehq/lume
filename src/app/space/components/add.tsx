import { AddFeedBlock } from '@app/space/components/addFeed';
import { AddHashTagBlock } from '@app/space/components/addHashtag';
import { AddImageBlock } from '@app/space/components/addImage';

export function AddBlock() {
  return (
    <div className="flex flex-col gap-1">
      <AddImageBlock />
      <AddFeedBlock />
      <AddHashTagBlock />
    </div>
  );
}
