import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings/")({
  component: Screen,
});

function Screen() {
  return <div>Settings</div>;
}
