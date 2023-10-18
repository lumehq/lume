import { isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification';

import { CheckCircleIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';

export function AllowNotification() {
  const [notification, setNotification] = useOnboarding((state) => [
    state.notification,
    state.toggleNotification,
  ]);

  const allow = async () => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
      setNotification();
    }
  };

  return (
    <div className="rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h5 className="font-semibold">Allow notification</h5>
          <p className="text-sm">
            By allowing Lume to send notifications in your OS settings, you will receive
            notification messages when someone interacts with you or your content.
          </p>
        </div>
        {notification ? (
          <div className="mt-1 inline-flex h-9 w-24 shrink-0 items-center justify-center rounded-lg bg-teal-500 text-white">
            <CheckCircleIcon className="h-4 w-4" />
          </div>
        ) : (
          <button
            type="button"
            onClick={allow}
            className="mt-1 inline-flex h-9 w-24 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
          >
            Allow
          </button>
        )}
      </div>
    </div>
  );
}
