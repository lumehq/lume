import { useNavigate } from 'react-router-dom';

import { ArrowRightIcon } from '@shared/icons';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { useResources } from '@stores/resources';

import { Widget } from '@utils/types';

export function LearnNostrWidget({ params }: { params: Widget }) {
  const navigate = useNavigate();
  const openResource = useResources((state) => state.openResource);
  const resources = useResources((state) => state.resources);
  const seens = useResources((state) => state.seens);

  const open = (naddr: string) => {
    // add resource to seen list
    openResource(naddr);
    // redirect
    navigate(`/notes/article/${naddr}`);
  };

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title="The Joy of Nostr" />
      <div className="scrollbar-hide h-full overflow-y-auto px-3 pb-20">
        {resources.map((resource, index) => (
          <div key={index} className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {resource.title}
            </h3>
            <div className="flex flex-col gap-2">
              {resource.data.length ? (
                resource.data.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => open(item.id)}
                    className="flex items-center justify-between rounded-xl bg-zinc-100 px-4 py-3 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    <div className="flex flex-col items-start">
                      <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </h5>
                      {seens.has(item.id) ? (
                        <p className="text-sm text-green-500">Readed</p>
                      ) : (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Unread</p>
                      )}
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-zinc-100 dark:text-zinc-900" />
                  </button>
                ))
              ) : (
                <div className="flex h-14 items-center justify-center rounded-xl bg-zinc-100 px-3 py-3 dark:bg-zinc-900">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    More resources are coming, stay tuned.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </WidgetWrapper>
  );
}
