import { Column } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/waifu")({
  component: Screen,
});

function Screen() {
  // @ts-ignore, just work!!!
  const { name } = Route.useSearch();

  return (
    <Column.Root>
      <Column.Header name={name} />
      <Column.Content>waifu</Column.Content>
    </Column.Root>
  );
}
