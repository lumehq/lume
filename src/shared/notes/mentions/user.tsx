import { useStorage } from '@libs/storage/provider';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function MentionUser({ pubkey }: { pubkey: string }) {
  const { db } = useStorage();
  const { user } = useProfile(pubkey);

  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() =>
        setWidget(db, {
          kind: WidgetKinds.local.user,
          title: user?.name || user?.display_name || user?.displayName,
          content: pubkey,
        })
      }
      onKeyDown={() =>
        setWidget(db, {
          kind: WidgetKinds.local.user,
          title: user?.name || user?.display_name || user?.displayName,
          content: pubkey,
        })
      }
      className="break-words text-fuchsia-400 hover:text-fuchsia-500"
    >
      {user?.name ||
        user?.display_name ||
        user?.displayName ||
        user?.username ||
        displayNpub(pubkey, 16)}
    </span>
  );
}
