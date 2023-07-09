import { NDKEvent, NDKKind, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';

import { useNDK } from '@libs/ndk/provider';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';
import { useSecureStorage } from '@utils/hooks/useSecureStorage';

export function usePublish() {
  const { ndk } = useNDK();
  const { account } = useAccount();
  const { load } = useSecureStorage();

  const privkey = useStronghold((state) => state.privkey);

  const publish = async ({
    content,
    kind,
    tags,
  }: {
    content: string;
    kind: NDKKind;
    tags: string[][];
  }): Promise<NDKEvent> => {
    const securePrivkey = await load(account.pubkey);

    const event = new NDKEvent(ndk);
    const signer = new NDKPrivateKeySigner(privkey ? privkey : securePrivkey);

    event.content = content;
    event.kind = kind;
    event.created_at = Math.floor(Date.now() / 1000);
    event.pubkey = account.pubkey;
    event.tags = tags;

    await event.sign(signer);
    await event.publish();

    return event;
  };

  return publish;
}
