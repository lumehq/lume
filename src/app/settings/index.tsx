import { ContactCard } from '@app/settings/components/contactCard';
import { PostCard } from '@app/settings/components/postCard';
import { ProfileCard } from '@app/settings/components/profileCard';
import { RelayCard } from '@app/settings/components/relayCard';
import { ZapCard } from '@app/settings/components/zapCard';

export function UserSettingScreen() {
  return (
    <div className="mx-auto w-full max-w-xl">
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
