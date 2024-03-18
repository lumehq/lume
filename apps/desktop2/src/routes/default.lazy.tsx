import { Column } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/default")({
  component: Screen,
});

function Screen() {
  return (
    <Column.Root>
      <Column.Content className="flex flex-col items-center justify-center">
        <p>TODO</p>
      </Column.Content>
    </Column.Root>
  );
}
