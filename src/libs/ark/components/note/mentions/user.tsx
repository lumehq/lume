import { memo } from 'react';
import { useProfile, useWidget } from '@libs/ark';
import { WIDGET_KIND } from '@utils/constants';

export const MentionUser = memo(function MentionUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);
  const { addWidget } = useWidget();

  return (
    <button
      type="button"
      onClick={() =>
        addWidget.mutate({
          kind: WIDGET_KIND.user,
          title: user?.name || user?.display_name || user?.displayName,
          content: pubkey,
        })
      }
      className="break-words text-blue-500 hover:text-blue-600"
    >
      {'@' + (user?.name || user?.displayName || user?.username || 'unknown')}
    </button>
  );
});
