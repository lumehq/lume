import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/splash")({
  component: Screen,
});

function Screen() {
  return <div>Loading..</div>;
}
