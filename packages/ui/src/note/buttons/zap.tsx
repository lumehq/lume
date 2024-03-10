import { useArk } from "@lume/ark";
import { ZapIcon } from "@lume/icons";

export function NoteZap() {
  const ark = useArk();

  const zap = async () => {
    const nwc = await ark.nwc_status();
    if (!nwc) {
      ark.open_nwc();
    } else {
      ark.open_zap();
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
