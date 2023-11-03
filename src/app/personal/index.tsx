import { ContactCard } from '@app/personal/components/contactCard';
import { PostCard } from '@app/personal/components/postCard';
import { ProfileCard } from '@app/personal/components/profileCard';
import { RelayCard } from '@app/personal/components/relayCard';
import { ZapCard } from '@app/personal/components/zapCard';

export function PersonalScreen() {
  return (
    <div className="mx-auto my-10 max-w-xl">
      <ProfileCard />
      <div className="grid grid-cols-2 gap-4">
        <ContactCard />
        <RelayCard />
        <PostCard />
        <ZapCard />
      </div>
    </div>
  );
}
