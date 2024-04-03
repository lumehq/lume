import { ArrowRightIcon, ZapIcon } from "@lume/icons";
import { Container } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/nwc")({
  component: Screen,
});

function Screen() {
  const { ark } = Route.useRouteContext();

  const [uri, setUri] = useState("");
  const [isDone, setIsDone] = useState(false);

  const save = async () => {
    const nwc = await ark.set_nwc(uri);

    if (nwc) {
      setIsDone(true);
    }
  };

  return (
    <Container withDrag>
      <div className="h-full w-full flex-1 px-5">
        {!isDone ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="inline-flex size-14 items-center justify-center rounded-xl bg-black text-white shadow-md">
                <ZapIcon className="size-5" />
              </div>
              <div>
                <h3 className="text-2xl font-light">
                  Connect <span className="font-semibold">bitcoin wallet</span>{" "}
                  to start zapping to your favorite content and creator.
                </h3>
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-2">
              <div className="flex flex-col gap-1.5">
                <label>Paste a Nostr Wallet Connect connection string</label>
                <textarea
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                  placeholder="nostrconnect://"
                  className="h-24 w-full resize-none rounded-lg border-transparent bg-white placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-100 dark:bg-black dark:focus:ring-blue-900"
                />
              </div>
              <button
                type="button"
                onClick={save}
                className="inline-flex h-11 w-full items-center justify-between gap-1.5 rounded-lg bg-blue-500 px-5 font-medium text-white hover:bg-blue-600"
              >
                <div className="size-5" />
                <div>Save & Connect</div>
                <ArrowRightIcon className="size-5" />
              </button>
            </div>
          </>
        ) : (
          <div>Done</div>
        )}
      </div>
    </Container>
  );
}
