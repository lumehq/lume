import { NDKEvent, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useContext, useState } from 'react';

import { UserReply } from '@app/channel/components/messages/userReply';

import { useNDK } from '@libs/ndk/provider';

import { CancelIcon, EnterIcon } from '@shared/icons';
import { MediaUploader } from '@shared/mediaUploader';

import { useChannelMessages } from '@stores/channels';

import { dateToUnix } from '@utils/date';
import { useAccount } from '@utils/hooks/useAccount';

export function ChannelMessageForm({ channelID }: { channelID: string }) {
  const { ndk } = useNDK();

  const [value, setValue] = useState('');
  const [replyTo, closeReply] = useChannelMessages((state: any) => [
    state.replyTo,
    state.closeReply,
  ]);

  const { account } = useAccount();

  const submit = () => {
    let tags: string[][];

    if (replyTo.id !== null) {
      tags = [
        ['e', channelID, '', 'root'],
        ['e', replyTo.id, '', 'reply'],
        ['p', replyTo.pubkey, ''],
      ];
    } else {
      tags = [['e', channelID, '', 'root']];
    }

    const signer = new NDKPrivateKeySigner(account.privkey);
    ndk.signer = signer;

    const event = new NDKEvent(ndk);
    // build event
    event.content = value;
    event.kind = 42;
    event.created_at = dateToUnix();
    event.pubkey = account.pubkey;
    event.tags = tags;

    // publish event
    event.publish();

    // reset state
    setValue('');
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const stopReply = () => {
    closeReply();
  };

  return (
    <div className={`relative w-full ${replyTo.id ? 'h-36' : 'h-24'}`}>
      {replyTo.id && (
        <div className="absolute left-0 top-0 z-10 h-16 w-full p-[2px]">
          <div className="flex h-full w-full items-center justify-between rounded-t-md border-b border-zinc-700/70 bg-zinc-900 px-3">
            <div className="flex w-full flex-col">
              <UserReply pubkey={replyTo.pubkey} />
              <div className="-mt-5 pl-[38px]">
                <div className="text-base text-zinc-100">{replyTo.content}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => stopReply()}
              className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800"
            >
              <CancelIcon width={12} height={12} className="text-zinc-100" />
            </button>
          </div>
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleEnterPress}
        spellCheck={false}
        placeholder="Message"
        className={`relative ${
          replyTo.id ? 'h-36 pt-16' : 'h-24 pt-3'
        } w-full resize-none rounded-md bg-zinc-800 px-5 !outline-none placeholder:text-zinc-500`}
      />
      <div className="absolute bottom-0 right-2 h-11">
        <div className="flex h-full items-center justify-end gap-3 text-zinc-500">
          <MediaUploader setState={setValue} />
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-1 text-sm leading-none"
          >
            <EnterIcon width={14} height={14} className="" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
