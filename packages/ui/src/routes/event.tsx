import { ArrowLeftIcon, ArrowRightIcon } from "@lume/icons";
import { useNavigate, useParams } from "react-router-dom";
import { WindowVirtualizer } from "virtua";
import { ThreadNote } from "../note/primitives/thread";

export function EventRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="overflow-y-auto pb-5">
      <WindowVirtualizer>
        <div className="relative z-50 mb-3 flex h-11 items-center justify-start gap-2 border-b border-neutral-100 bg-neutral-50 px-3 dark:border-neutral-900 dark:bg-neutral-950">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-neutral-100 hover:text-blue-500 dark:hover:bg-neutral-900"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-neutral-100 hover:text-blue-500 dark:hover:bg-neutral-900"
            onClick={() => navigate(1)}
          >
            <ArrowRightIcon className="size-5" />
          </button>
        </div>
        <div className="px-3">
          <ThreadNote eventId={id} />
          <ReplyList eventId={id} className="mt-3" />
        </div>
      </WindowVirtualizer>
    </div>
  );
}
