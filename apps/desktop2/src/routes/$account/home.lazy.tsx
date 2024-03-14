import { Newsfeed } from "@/components/newsfeed";
import { createLazyFileRoute } from "@tanstack/react-router";
import { VList } from "virtua";

export const Route = createLazyFileRoute("/$account/home")({
  component: Screen,
});

function Screen() {
  return (
    <div className="relative h-full w-full">
      <VList
        className="scrollbar-none h-full w-full overflow-x-auto pb-2 pt-1.5 focus:outline-none"
        itemSize={420}
        tabIndex={0}
        horizontal
      >
        <Newsfeed />
        <div className="mx-2 h-full w-[420px] rounded-xl bg-white">todo!</div>
      </VList>
    </div>
  );
}
