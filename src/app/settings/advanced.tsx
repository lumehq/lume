export function AdvancedSettingScreen() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-center justify-between">
          <div className="w-24 shrink-0 text-end text-sm font-semibold">Event Caches</div>
          <button
            type="button"
            className="h-9 w-max rounded-lg bg-blue-500 px-2.5 text-white hover:bg-blue-600"
          >
            Clear
          </button>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="w-24 shrink-0 text-end text-sm font-semibold">User Caches</div>
          <button
            type="button"
            className="h-9 w-max rounded-lg bg-blue-500 px-2.5 text-white hover:bg-blue-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
