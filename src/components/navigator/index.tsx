import Chats from '@components/navigator/chats';
import Newsfeed from '@components/navigator/newsfeed';

export default function Navigation() {
  return (
    <div className="relative flex h-full flex-col gap-1 overflow-hidden pt-4">
      {/* Newsfeed */}
      <Newsfeed />
      {/* Chats */}
      <Chats />
    </div>
  );
}
