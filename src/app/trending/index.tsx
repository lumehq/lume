import { TrendingNotes } from '@app/trending/components/trendingNotes';
import { TrendingProfiles } from '@app/trending/components/trendingProfiles';

export function TrendingScreen() {
  return (
    <div className="scrollbar-hide flex h-full w-full flex-nowrap divide-x divide-white/5 overflow-x-auto overflow-y-hidden">
      <TrendingProfiles />
      <TrendingNotes />
    </div>
  );
}
