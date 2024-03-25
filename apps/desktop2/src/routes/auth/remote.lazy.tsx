import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth/remote")({
  component: Screen,
});

function Screen() {
  return <div>#todo</div>;
}
