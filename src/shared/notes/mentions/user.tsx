import { memo } from 'react';

import { useStorage } from '@libs/storage/provider';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { useProfile } from '@utils/hooks/useProfile';

export const MentionUser = memo(function MentionUser({ pubkey }: { pubkey: string }) {
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
      className="break-words text-blue-500 hover:text-blue-600"
    >
      {'@' +
        (user?.name ||
          user?.display_name ||
          user?.displayName ||
          user?.username ||
          'unknown')}
    </span>
  );
});
