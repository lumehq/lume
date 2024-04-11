import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/store/community")({
  component: Screen,
});

function Screen() {
  return (
    <div className="flex flex-col gap-3 p-3">
      <p>Coming Soon</p>
    </div>
  );
}
