import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { useStorage } from '@libs/storage/provider';

import {
  FeedIcon,
  FileIcon,
  HashtagIcon,
  PlusIcon,
  ThreadsIcon,
  TrendingIcon,
} from '@shared/icons';

import { WidgetKinds, useWidgets } from '@stores/widgets';

export function AddWidgetButton() {
  const { db } = useStorage();
  const setWidget = useWidgets((state) => state.setWidget);

  const setTrendingProfilesWidget = () => {
    setWidget(db, {
      kind: WidgetKinds.trendingProfiles,
      title: 'Trending Profiles',
      content: 'https://api.nostr.band/v0/trending/profiles',
    });
  };

  const setTrendingNotesWidget = () => {
    setWidget(db, {
      kind: WidgetKinds.trendingNotes,
      title: 'Trending Notes',
      content: 'https://api.nostr.band/v0/trending/notes',
    });
  };

  const setArticleWidget = () => {
    setWidget(db, {
      kind: WidgetKinds.article,
      title: 'Articles',
      content: '',
    });
  };

  const setFileWidget = () => {
    setWidget(db, {
      kind: WidgetKinds.file,
      title: 'Files',
      content: '',
    });
  };

  const setHashtagWidget = () => {
    setWidget(db, {
      kind: WidgetKinds.xhashtag,
      title: 'New hashtag',
      content: '',
    });
  };

  const setGroupFeedWidget = () => {
    setWidget(db, {
      kind: WidgetKinds.xfeed,
      title: 'New user group feed',
      content: '',
    });
  };

  return (
    <DropdownMenu.Root>
      <div className="flex h-full shrink-0 grow-0 basis-[400px] flex-col">
        <div className="inline-flex h-full w-full flex-col items-center justify-center">
          <DropdownMenu.Trigger asChild>
            <button type="button" className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 backdrop-blur-xl hover:bg-white/10">
                <PlusIcon className="h-5 w-5 text-white" />
              </div>
              <p className="font-medium text-white/50">Add widget</p>
            </button>
          </DropdownMenu.Trigger>
        </div>
      </div>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={-20}
          className="flex w-[256px] flex-col overflow-hidden rounded-md bg-white/10 p-2 backdrop-blur-3xl backdrop-blur-xl focus:outline-none"
        >
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={setHashtagWidget}
              className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                <HashtagIcon className="h-4 w-4 text-white" />
              </div>
              Add hashtag feeds
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={setGroupFeedWidget}
              className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                <FeedIcon className="h-4 w-4 text-white" />
              </div>
              Add user group feeds
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={setArticleWidget}
              className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                <ThreadsIcon className="h-4 w-4 text-white" />
              </div>
              Add article feeds
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={setFileWidget}
              className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                <FileIcon className="h-4 w-4 text-white" />
              </div>
              Add file feeds
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={setTrendingProfilesWidget}
              className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                <TrendingIcon className="h-4 w-4 text-white" />
              </div>
              Add trending accounts
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={setTrendingNotesWidget}
              className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                <TrendingIcon className="h-4 w-4 text-white" />
              </div>
              Add trending notes
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
