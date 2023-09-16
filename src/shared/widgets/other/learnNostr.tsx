import { useNavigate } from 'react-router-dom';

import { ArrowRightIcon } from '@shared/icons';
import { TitleBar } from '@shared/titleBar';

import { useResources } from '@stores/resources';

import { Widget } from '@utils/types';

export function LearnNostrWidget({ params }: { params: Widget }) {
  const navigate = useNavigate();
  const readResource = useResources((state) => state.readResource);

  const resources = useResources((state) => state.resources);
  const readed = useResources((state) => state.readed);

  const open = (naddr: string) => {
    readResource(naddr);
    navigate(`/notes/article/${naddr}`);
  };

  return (
    <div className="relative shrink-0 grow-0 basis-[400px] bg-white/10 backdrop-blur-xl">
      <TitleBar id={params.id} title="The Joy of Nostr" />
      <div className="scrollbar-hide h-full overflow-y-auto px-3 pb-20">
        {resources.map((resource, index) => (
          <div key={index} className="mb-6">
            <h3 className="mb-2 font-medium text-white/50">{resource.title}</h3>
            <div className="flex flex-col gap-2">
              {resource.data.length ? (
                resource.data.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => open(item.id)}
                    className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-3 hover:bg-white/20"
                  >
                    <div className="inline-flex items-center gap-2.5">
                      <div className="h-10 w-10 shrink-0 rounded-md bg-white/10" />
                      <div className="flex flex-col items-start gap-1">
                        <h5 className="font-semibold leading-none">{item.title}</h5>
                        {readed.has(item.id) ? (
                          <p className="text-sm leading-none text-green-500">Readed</p>
                        ) : (
                          <p className="text-sm leading-none text-white/70">Unread</p>
                        )}
                      </div>
                    </div>
                    <button type="button">
                      <ArrowRightIcon className="h-5 w-5 text-white" />
                    </button>
                  </button>
                ))
              ) : (
                <div className="flex h-14 items-center justify-center rounded-xl bg-white/10 px-3 py-3">
                  <p className="text-sm font-medium text-white">
                    More resources are coming, stay tuned.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
