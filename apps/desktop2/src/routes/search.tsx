import { SearchIcon } from "@lume/icons";
import { type Event, Kind } from "@lume/types";
import { Note, Spinner, User } from "@lume/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export const Route = createFileRoute("/search")({
  component: Screen,
});

function Screen() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 500);

  const searchEvents = async () => {
    try {
      setLoading(true);

      const query = `https://api.nostr.wine/search?query=${searchValue}&kind=0,1`;
      const res = await fetch(query);
      const content = await res.json();
      const events = content.data as Event[];
      const sorted = events.sort((a, b) => b.created_at - a.created_at);

      setLoading(false);
      setEvents(sorted);
    } catch (e) {
      setLoading(false);
      toast.error(String(e));
    }
  };

  useEffect(() => {
    if (searchValue.length >= 3 && searchValue.length < 500) {
      searchEvents();
    }
  }, [searchValue]);

  return (
    <div data-tauri-drag-region className="flex flex-col w-full h-full">
      <div className="relative h-24 shrink-0 flex flex-col border-b border-black/5 dark:border-white/5">
        <div data-tauri-drag-region className="w-full h-4 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchEvents();
          }}
          placeholder="Search anything..."
          className="w-full h-20 pt-10 px-3 text-lg bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-600"
        />
      </div>
      <div className="flex-1 p-3 overflow-y-auto scrollbar-none">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : events.length ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 shrink-0">
                Users
              </div>
              <div className="flex-1 flex flex-col gap-1">
                {events
                  .filter((ev) => ev.kind === Kind.Metadata)
                  .map((event, index) => (
                    <SearchUser key={event.pubkey + index} event={event} />
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 shrink-0">
                Notes
              </div>
              <div className="flex-1 flex flex-col gap-3">
                {events
                  .filter((ev) => ev.kind === Kind.Text)
                  .map((event) => (
                    <SearchNote key={event.id} event={event} />
                  ))}
              </div>
            </div>
          </div>
        ) : null}
        {!loading && !events.length ? (
          <div className="h-full flex items-center justify-center flex-col gap-3">
            <div className="size-16 bg-black/10 dark:bg-white/10 rounded-full inline-flex items-center justify-center">
              <SearchIcon className="size-6" />
            </div>
            Try searching for people, notes, or keywords
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SearchUser({ event }: { event: Event }) {
  const { ark } = Route.useRouteContext();

  return (
    <button
      key={event.id}
      type="button"
      onClick={() => ark.open_profile(event.pubkey)}
      className="col-span-1 p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg"
    >
      <User.Provider pubkey={event.pubkey} embedProfile={event.content}>
        <User.Root className="flex items-center gap-2">
          <User.Avatar className="size-9 rounded-full shrink-0" />
          <div className="inline-flex items-center gap-1.5">
            <User.Name className="font-semibold" />
            <User.NIP05 />
          </div>
        </User.Root>
      </User.Provider>
    </button>
  );
}

function SearchNote({ event }: { event: Event }) {
  return (
    <div className="bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl shadow-primary dark:ring-1 ring-neutral-800/50">
      <Note.Provider event={event}>
        <Note.Root>
          <div className="px-3 h-14 flex items-center justify-between">
            <Note.User />
            <Note.Menu />
          </div>
          <Note.Content className="px-3" quote={false} mention={false} />
          <div className="mt-3 flex items-center gap-4 h-14 px-3">
            <Note.Open />
          </div>
        </Note.Root>
      </Note.Provider>
    </div>
  );
}
