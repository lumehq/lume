import { ArrowLeftIcon, ArrowRightIcon } from "@lume/icons";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Toolbar({
  moveLeft,
  moveRight,
}: {
  moveLeft: () => void;
  moveRight: () => void;
}) {
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    setDomReady(true);
  }, []);

  return domReady
    ? createPortal(
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => moveLeft()}
            className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => moveRight()}
            className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <ArrowRightIcon className="size-5" />
          </button>
        </div>,
        document.getElementById("toolbar"),
      )
    : null;
}
