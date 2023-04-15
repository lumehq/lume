export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <div className="flex h-screen w-full flex-col">
        <div
          data-tauri-drag-region
          className="relative h-11 shrink-0 border-b border-zinc-100 bg-white dark:border-zinc-900 dark:bg-black"
        ></div>
        <div className="relative flex min-h-0 w-full flex-1">{children}</div>
      </div>
    </div>
  );
}
