import Messages from '@components/columns/navigator/messages';
import Newsfeed from '@components/columns/navigator/newsfeed';

export default function NavigatorColumn() {
  return (
    <div className="relative flex h-full flex-col gap-1 overflow-hidden pt-4">
      {/* Newsfeed */}
      <Newsfeed />
      {/* Messages */}
      <Messages />
    </div>
  );
}
