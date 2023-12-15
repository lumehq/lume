import { configDir, resolveResource } from '@tauri-apps/api/path';
import { Command } from '@tauri-apps/plugin-shell';

export function DepotScreen() {
  const launch = async () => {
    const configPath = await resolveResource('resources/config.toml');
    const dataPath = await configDir();

    const command = Command.sidecar('bin/depot', ['-c', configPath, '-d', dataPath]);
    const process = await command.spawn();

    process.pid;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 py-10">
        <h1 className="text-center text-lg font-semibold">Depot</h1>
        <button
          type="button"
          onClick={() => launch()}
          className="h-9 w-max rounded-lg bg-blue-500 px-2 text-white"
        >
          Launch
        </button>
      </div>
    </div>
  );
}
