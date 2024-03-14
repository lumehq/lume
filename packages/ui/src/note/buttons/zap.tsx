import { useArk } from "@lume/ark";
import { ZapIcon } from "@lume/icons";
import { toast } from "sonner";
import { useNoteContext } from "../provider";
import { useSearch } from "@tanstack/react-router";

export function NoteZap() {
  const ark = useArk();
  const event = useNoteContext();

  const { account } = useSearch({ strict: false });

  const zap = async () => {
    try {
      const nwc = await ark.load_nwc();
      if (!nwc) {
        ark.open_nwc();
      } else {
        ark.open_zap(event.id, event.pubkey, account);
      }
    } catch (e) {
      toast.error(String(e));
    }
  };

  return (
    <button
      type="button"
      onClick={zap}
      className="group inline-flex size-7 items-center justify-center text-neutral-800 dark:text-neutral-200"
    >
      <ZapIcon className="size-5 group-hover:text-blue-500" />
    </button>
  );
}
