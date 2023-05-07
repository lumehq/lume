import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

export const NoteMentionUser = (props: { children: any[] }) => {
  const pubkey = props.children[0];
  const { user } = useProfile(pubkey);

  return <span className="cursor-pointer text-fuchsia-500">@{user?.username || user?.name || shortenKey(pubkey)}</span>;
};
