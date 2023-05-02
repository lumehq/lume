import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

export const NoteMentionUser = ({ pubkey }: { pubkey: string }) => {
  const { user, isError, isLoading } = useProfile(pubkey);

  return (
    <>
      {isError || isLoading ? (
        <span className="inline-flex h-4 w-10 animate-pulse rounded bg-zinc-800"></span>
      ) : (
        <span className="cursor-pointer text-fuchsia-500">@{user?.username || user?.name || shortenKey(pubkey)}</span>
      )}
    </>
  );
};
