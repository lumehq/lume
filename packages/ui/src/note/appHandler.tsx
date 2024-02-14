import { useArk } from "@lume/ark";
import { useQuery } from "@tanstack/react-query";

export function AppHandler({ tag }: { tag: string[] }) {
  const ark = useArk();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["app-handler", tag[1]],
    queryFn: async () => {
      const ref = tag[1].split(":");
      const event = await ark.getEventByFilter({
        filter: {
          kinds: [Number(ref[0])],
          authors: [ref[1]],
          "#d": [ref[2]],
        },
      });

      if (!event) return null;

      const app = NDKAppHandlerEvent.from(event);
      return await app.fetchProfile();
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error</div>;
  }

  return (
    <div className="flex items-center gap-2 rounded-md bg-neutral-200 p-2 hover:ring-1 hover:ring-blue-500 dark:bg-neutral-800">
      <img
        src={data?.picture || data?.image}
        alt={data.pubkey}
        decoding="async"
        className="h-9 w-9 shrink-0 rounded-lg bg-white object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50"
      />
      <div className="flex flex-col">
        <div className="max-w-[15rem] truncate font-semibold text-neutral-950 dark:text-neutral-50">
          {data.name}
        </div>
        <div className="line-clamp-1 text-sm text-neutral-600 dark:text-neutral-400">
          {data.about}
        </div>
      </div>
    </div>
  );
}
