import Channels from '@components/navigation/channels';
import Chats from '@components/navigation/chats';
import Newsfeed from '@components/navigation/newsfeed';

export default function Navigation() {
  return (
    <div className="relative flex h-full flex-col gap-1 overflow-hidden pt-3">
      {/* Newsfeed */}
      <Newsfeed />
      {/* Channels */}
      <Channels />
      {/* Chats */}
      <Chats />
    </div>
  );
}
