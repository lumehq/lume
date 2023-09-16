import { Link } from 'react-router-dom';

import { ArrowRightIcon } from '@shared/icons';
import { TitleBar } from '@shared/titleBar';

import { Widget } from '@utils/types';

const resources = [
  {
    title: 'The Basics (provide by nostr.com)',
    data: [
      {
        title: 'What is Nostr?',
        image: '',
        url: '',
      },
      {
        title: 'Understanding keys',
        image: '',
        url: '',
      },
      {
        title: "What's a client?",
        image: '',
        url: '',
      },
      {
        title: 'What are relays?',
        image: '',
        url: '',
      },
      {
        title: 'What is an event?',
        image: '',
        url: '',
      },
      {
        title: 'How to help Nostr?',
        image: '',
        url: '',
      },
    ],
  },
  {
    title: 'Lume Tutorials',
    data: [
      {
        title: 'How to use widget?',
        image: '',
        url: '',
      },
      {
        title: 'How to send a post?',
        image: '',
        url: '',
      },
      {
        title: 'How to find more people?',
        image: '',
        url: '',
      },
      {
        title: 'How to edit your profile?',
        image: '',
        url: '',
      },
      {
        title: 'How to use focus mode?',
        image: '',
        url: '',
      },
      {
        title: 'Report an issue',
        image: '',
        url: '',
      },
      {
        title: 'How to support Lume',
        image: '',
        url: '',
      },
    ],
  },
];

export function LearnNostrWidget({ params }: { params: Widget }) {
  return (
    <div className="relative shrink-0 grow-0 basis-[400px] bg-white/10 backdrop-blur-xl">
      <TitleBar id={params.id} title="The Joy of Nostr" />
      <div className="scrollbar-hide h-full overflow-y-auto px-3 pb-20">
        {resources.map((resource, index) => (
          <div key={index} className="mb-6">
            <h3 className="mb-2 font-medium text-white/50">{resource.title}</h3>
            <div className="flex flex-col gap-2">
              {resource.data.map((item, index) => (
                <Link
                  key={index}
                  to={`/notes/articles/${item.url}`}
                  className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-3 hover:bg-white/20"
                >
                  <div className="inline-flex items-center gap-2.5">
                    <div className="h-10 w-10 shrink-0 rounded-md bg-white/10" />
                    <div className="flex flex-col gap-1">
                      <h5 className="font-semibold leading-none">{item.title}</h5>
                      <p className="text-sm leading-none text-white/70">Unread</p>
                    </div>
                  </div>
                  <button type="button">
                    <ArrowRightIcon className="h-5 w-5 text-white" />
                  </button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
