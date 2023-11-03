import { ContactCard } from '@app/personal/components/contactCard';
import { PostCard } from '@app/personal/components/postCard';
import { ProfileCard } from '@app/personal/components/profileCard';
import { RelayCard } from '@app/personal/components/relayCard';
import { ZapCard } from '@app/personal/components/zapCard';

export function PersonalScreen() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="flex h-14 shrink-0 items-center justify-between px-3">
        <div className="w-20" />
        <h1 className="font-semibold">Personal Dashboard</h1>
        <div className="w-20" />
      </div>
      <div className="mx-auto w-full max-w-xl">
        <ProfileCard />
        <div className="grid grid-cols-2 gap-4">
          <ContactCard />
          <RelayCard />
          <PostCard />
          <ZapCard />
        </div>
      </div>
    </div>
  );
}
