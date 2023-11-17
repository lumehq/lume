import { ArticleIcon, MediaIcon, PlusIcon } from '@shared/icons';
import { TitleBar } from '@shared/titleBar';
import { AddGroupFeeds, AddHashtagFeeds, WidgetWrapper } from '@shared/widgets';

import { TOPICS, WIDGET_KIND } from '@stores/constants';

import { useWidget } from '@utils/hooks/useWidget';
import { Widget } from '@utils/types';

export function WidgetList({ widget }: { widget: Widget }) {
  const { replaceWidget } = useWidget();

  return (
    <WidgetWrapper>
      <TitleBar id={widget.id} title="Add widgets" />
      <div className="flex-1 overflow-y-auto pb-10 scrollbar-none">
        <div className="flex flex-col gap-6 px-3">
          <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
            <h3 className="mb-2.5 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
              Topics
            </h3>
            <div className="flex flex-col gap-3">
              {TOPICS.sort((a, b) => a.title.localeCompare(b.title)).map(
                (topic, index) => (
                  <div
                    key={index}
                    className="inline-flex h-14 w-full items-center justify-between rounded-lg bg-neutral-50 px-3 ring-1 ring-transparent hover:ring-neutral-200 dark:bg-neutral-950 dark:hover:ring-neutral-800"
                  >
                    <div className="inline-flex items-center gap-2.5">
                      <div className="h-9 w-9 shrink-0 rounded-md">
                        <img
                          src={`/${topic.title.toLowerCase()}.jpg`}
                          alt={topic.title}
                          className="h-9 w-9 rounded-md"
                        />
                      </div>
                      <p className="font-medium">{topic.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        replaceWidget.mutate({
                          currentId: widget.id,
                          widget: {
                            kind: WIDGET_KIND.topic,
                            title: topic.title,
                            content: JSON.stringify(topic.content),
                          },
                        })
                      }
                      className="inline-flex h-6 items-center gap-1 rounded-md bg-neutral-100 pl-1.5 pr-2.5 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-900"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
            <h3 className="mb-2.5 text-sm font-semibold uppercase text-neutral-700 dark:text-neutral-300">
              Newsfeed
            </h3>
            <div className="flex flex-col gap-3">
              <AddGroupFeeds currentWidgetId={widget.id} />
              <AddHashtagFeeds currentWidgetId={widget.id} />
              <div className="inline-flex h-14 w-full items-center justify-between rounded-lg bg-neutral-50 px-3 hover:shadow-md hover:shadow-neutral-200/50 dark:bg-neutral-950 dark:hover:shadow-neutral-800/50">
                <div className="inline-flex items-center gap-2.5">
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900">
                    <ArticleIcon className="h-4 w-4" />
                  </div>
                  <p className="font-medium">Articles</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    replaceWidget.mutate({
                      currentId: widget.id,
                      widget: {
                        kind: WIDGET_KIND.article,
                        title: 'Articles',
                        content: JSON.stringify({ global: true }),
                      },
                    })
                  }
                  className="inline-flex h-6 items-center gap-1 rounded-md bg-neutral-100 pl-1.5 pr-2.5 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-900"
                >
                  <PlusIcon className="h-3 w-3" />
                  Add
                </button>
              </div>
              <div className="inline-flex h-14 w-full items-center justify-between rounded-lg bg-neutral-50 px-3 hover:shadow-md hover:shadow-neutral-200/50 dark:bg-neutral-950 dark:hover:shadow-neutral-800/50">
                <div className="inline-flex items-center gap-2.5">
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900">
                    <MediaIcon className="h-4 w-4" />
                  </div>
                  <p className="font-medium">Media</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    replaceWidget.mutate({
                      currentId: widget.id,
                      widget: {
                        kind: WIDGET_KIND.file,
                        title: 'Media',
                        content: JSON.stringify({ global: true }),
                      },
                    })
                  }
                  className="inline-flex h-6 items-center gap-1 rounded-md bg-neutral-100 pl-1.5 pr-2.5 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-900"
                >
                  <PlusIcon className="h-3 w-3" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
}
