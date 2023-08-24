import { useStorage } from '@libs/storage/provider';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function MentionUser({ pubkey }: { pubkey: string }) {
  const { db } = useStorage();
  const { user } = useProfile(pubkey);

  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <button
      type="button"
      onClick={() =>
        setWidget(db, {
          kind: WidgetKinds.user,
          title: user?.nip05 || user?.name || user?.display_name,
          content: pubkey,
        })
      }
      className="break-words text-fuchsia-400 hover:text-fuchsia-500"
    >
      {user?.nip05 ||
        user?.name ||
        user?.display_name ||
        user?.username ||
        displayNpub(pubkey, 16)}
    </button>
  );
}
