import { useArk } from '@libs/ark';

export function AdvancedSettingScreen() {
  const ark = useArk();

  const clearCache = async () => {
    await ark.clearCache();
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-24 shrink-0 text-end text-sm font-semibold">Caches</div>
            <div className="text-sm">Use for boost up NDK</div>
          </div>
          <button
            type="button"
            onClick={() => clearCache()}
            className="h-8 w-max rounded-lg bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
