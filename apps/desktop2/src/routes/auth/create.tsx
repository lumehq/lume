import { LoaderIcon } from "@lume/icons";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/create")({
  component: Screen,
  loader: ({ context }) => {
    return context.ark.create_keys();
  },
  pendingComponent: Pending,
});

function Screen() {
  return <div className="px-5"></div>;
}

function Pending() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-2">
      <button type="button" className="size-5" disabled>
        <LoaderIcon className="size-5 animate-spin" />
      </button>
      <p>Creating account</p>
    </div>
  );
}
