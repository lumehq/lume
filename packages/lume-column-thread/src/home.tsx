import { ThreadNote } from "@lume/ark";
import { ReplyList } from "@lume/ui";
import { WindowVirtualizer } from "virtua";

export function HomeRoute({ id }: { id: string }) {
  return (
    <div className="overflow-y-auto pb-5">
      <WindowVirtualizer>
        <div className="mt-3 px-3">
          <ThreadNote eventId={id} />
          <ReplyList eventId={id} className="mt-5" />
        </div>
      </WindowVirtualizer>
    </div>
  );
}
