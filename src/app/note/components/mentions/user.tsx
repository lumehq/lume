import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export function MentionUser(props: { children: any[] }) {
  const pubkey = props.children[0];
  const { user } = useProfile(pubkey);

  return <span className="text-fuchsia-500">@{user?.name || user?.display_name || shortenKey(pubkey)}</span>;
}
