import { memo } from 'react';

import { WidgetKinds } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { useWidget } from '@utils/hooks/useWidget';

export const MentionUser = memo(function MentionUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);
  const { addWidget } = useWidget();

  return (
    <button
      type="button"
      onClick={() =>
        addWidget.mutate({
          kind: WidgetKinds.local.user,
          title: user?.name || user?.display_name || user?.displayName,
          content: pubkey,
        })
      }
      onKeyDown={() =>
        addWidget.mutate({
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
    </button>
  );
});
