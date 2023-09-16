import { ArrowRightIcon } from '@shared/icons';
import { TitleBar } from '@shared/titleBar';

import { Widget } from '@utils/types';

export function LearnNostrWidget({ params }: { params: Widget }) {
  return (
    <div className="relative shrink-0 grow-0 basis-[400px] bg-white/10 backdrop-blur-xl">
      <TitleBar id={params.id} title="The Joy of Nostr" />
      <div className="flex h-full flex-col gap-6 px-3">
        <div>
          <h3 className="mb-2 font-medium text-white/50">The Basics</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-3">
              <div className="inline-flex items-center gap-2.5">
                <div className="h-10 w-10 shrink-0 rounded-md bg-white/10" />
                <div className="flex flex-col gap-1">
                  <h5 className="font-semibold leading-none">What is Nostr?</h5>
                  <p className="text-sm leading-none text-white/70">Unread</p>
                </div>
              </div>
              <button type="button">
                <ArrowRightIcon className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-3">
              <div className="inline-flex items-center gap-2.5">
                <div className="h-10 w-10 shrink-0 rounded-md bg-white/10" />
                <div className="flex flex-col gap-1">
                  <h5 className="font-semibold leading-none">Understanding keys</h5>
                  <p className="text-sm leading-none text-white/70">Unread</p>
                </div>
              </div>
              <button type="button">
                <ArrowRightIcon className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-3">
              <div className="inline-flex items-center gap-2.5">
                <div className="h-10 w-10 shrink-0 rounded-md bg-white/10" />
                <div className="flex flex-col gap-1">
                  <h5 className="font-semibold leading-none">What&apos;s a client?</h5>
                  <p className="text-sm leading-none text-white/70">Unread</p>
                </div>
              </div>
              <button type="button">
                <ArrowRightIcon className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-3">
              <div className="inline-flex items-center gap-2.5">
                <div className="h-10 w-10 shrink-0 rounded-md bg-white/10" />
                <div className="flex flex-col gap-1">
                  <h5 className="font-semibold leading-none">What are relays?</h5>
                  <p className="text-sm leading-none text-white/70">Unread</p>
                </div>
              </div>
              <button type="button">
                <ArrowRightIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
