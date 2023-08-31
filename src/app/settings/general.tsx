import { AutoStartSetting } from '@app/settings/components/autoStart';
import { DataPath } from '@app/settings/components/dataPath';
import { VersionSetting } from '@app/settings/components/version';

export function GeneralSettingsScreen() {
  return (
    <div className="h-full w-full px-3 pt-11">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-white">General</h1>
        <div className="w-full rounded-xl bg-white/10 backdrop-blur-xl">
          <div className="flex h-full w-full flex-col divide-y divide-white/5">
            <AutoStartSetting />
            <DataPath />
            <VersionSetting />
          </div>
        </div>
      </div>
    </div>
  );
}
