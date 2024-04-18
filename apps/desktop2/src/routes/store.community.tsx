import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/store/community")({
  component: Screen,
});

function Screen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-3">
      <div className="size-24 bg-blue-100 flex flex-col items-center justify-end overflow-hidden dark:bg-blue-900 rounded-full">
        <div className="w-12 h-16 bg-gradient-to-b from-blue-500 dark:from-blue-200 to-blue-50 dark:to-blue-900 rounded-t-lg" />
      </div>
      <div className="text-center">
        <h1 className="font-semibold text-lg">Coming Soon</h1>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-tight">
          Enhance your experience <br /> by adding column shared by community.
        </p>
      </div>
    </div>
  );
}
