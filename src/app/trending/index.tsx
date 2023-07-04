import { TrendingNotes } from '@app/trending/components/trendingNotes';
import { TrendingProfiles } from '@app/trending/components/trendingProfiles';

export function TrendingScreen() {
  return (
    <div className="scrollbar-hide flex h-full w-full flex-nowrap overflow-x-auto overflow-y-hidden">
      <TrendingProfiles />
      <TrendingNotes />
    </div>
  );
}
