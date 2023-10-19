export function AutoStartSetting() {
  return (
    <div className="inline-flex items-center justify-between px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium leading-none text-neutral-200">Auto start</span>
        <span className="text-sm leading-none text-neutral-600 dark:text-neutral-400">
          Auto start at login
        </span>
      </div>
    </div>
  );
}
