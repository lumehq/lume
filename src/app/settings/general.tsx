import { AutoStartSetting } from '@app/settings/components/autoStart';
import { CacheTimeSetting } from '@app/settings/components/cacheTime';
import { VersionSetting } from '@app/settings/components/version';

export function GeneralSettingsScreen() {
  return (
    <div className="h-full w-full px-3 pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-zinc-100">General</h1>
        <div className="w-full rounded-xl border-t border-zinc-800/50 bg-zinc-900">
          <div className="flex h-full w-full flex-col divide-y divide-zinc-800">
            <AutoStartSetting />
            <CacheTimeSetting />
            <VersionSetting />
          </div>
        </div>
      </div>
    </div>
  );
}
