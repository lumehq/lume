import MiniMember from '@app/channel/components/miniMember';

import { channelMembersAtom } from '@stores/channel';

import { useAtomValue } from 'jotai';

export default function ChannelMembers() {
  const membersAsSet = useAtomValue(channelMembersAtom);
  const membersAsArray = [...membersAsSet];
  const miniMembersList = membersAsArray.slice(0, 4);
  const totalMembers =
    membersAsArray.length > 0
      ? '+' +
        Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(membersAsArray.length)
      : 0;

  return (
    <div>
      <div className="group flex -space-x-2 overflow-hidden hover:-space-x-1">
        {miniMembersList.map((member, index) => (
          <MiniMember key={index} pubkey={member} />
        ))}
        {totalMembers ? (
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 ring-2 ring-zinc-950 transition-all duration-150 ease-in-out group-hover:bg-zinc-800">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200">{totalMembers}</span>
          </div>
        ) : (
          <div>
            <button className="inline-flex h-8 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm text-white shadow-button">
              Invite
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
