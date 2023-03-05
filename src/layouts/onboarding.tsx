export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="relative h-full w-[70px] shrink-0 border-r border-zinc-900">
        <div data-tauri-drag-region className="absolute top-0 left-0 h-12 w-full" />
      </div>
      <div className="grid grow grid-cols-4">
        <div className="col-span-1"></div>
        <div className="col-span-3 m-3 ml-0 overflow-hidden rounded-lg bg-zinc-900 shadow-md ring-1 ring-inset dark:shadow-black/10 dark:ring-white/10">
          {children}
        </div>
      </div>
    </div>
  );
}
