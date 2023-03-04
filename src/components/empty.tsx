import { EnvelopeClosedIcon, PlusIcon, UpdateIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

const sampleData = [
  {
    name: 'Dick Whitman (🌎/21M)',
    role: 'dickwhitman@nostrplebs.com',
    imageUrl: 'https://pbs.twimg.com/profile_images/1594930968325984256/TjMXaXBE_400x400.jpg',
  },
  {
    name: 'Jack',
    role: 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m',
    imageUrl: 'https://pbs.twimg.com/profile_images/1115644092329758721/AFjOr-K8_400x400.jpg',
  },
  {
    name: 'Sats Symbol',
    role: 'npub1mqngkfwfyv2ckv7hshck9pqucpz08tktde2jukr3hheatup2y2tqnzc32w',
    imageUrl: 'https://pbs.twimg.com/profile_images/1563388888860594177/7evrI1uB_400x400.jpg',
  },
];

export default function Empty() {
  return (
    <div className="mx-auto max-w-lg pt-8">
      <div>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-zinc-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <h2 className="mt-2 text-lg font-medium text-zinc-100">You haven&apos;t followed anyone yet</h2>
          <p className="mt-1 text-sm text-zinc-500">
            You can send invite via email to your friend and lume will onboard them into nostr or follow some people in
            suggested below
          </p>
        </div>
        <form action="#" className="relative mt-6">
          <input
            type="email"
            name="email"
            id="email"
            className="block h-11 w-full rounded-lg border-none px-4 shadow-md ring-1 ring-white/10 placeholder:text-zinc-500 dark:bg-zinc-800 dark:text-zinc-200"
            placeholder="Enter an email"
          />
          <button className="absolute right-0.5 top-1/2 inline-flex h-10 -translate-y-1/2 transform items-center gap-1 rounded-md border border-zinc-600 bg-zinc-700 px-4 text-sm font-medium text-zinc-200 shadow-md">
            <EnvelopeClosedIcon className="h-4 w-4" />
            Invite
          </button>
        </form>
      </div>
      <div className="mt-10 flex flex-col items-start gap-4">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-500">Suggestions</h3>
          <UpdateIcon className="h-4 w-4 text-zinc-600" />
        </div>
        <ul className="w-full divide-y divide-zinc-800 border-t border-b border-zinc-800">
          {sampleData.map((person, index) => (
            <li key={index} className="flex items-center justify-between space-x-3 py-4">
              <div className="flex min-w-0 flex-1 items-center space-x-3">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image className="rounded-full object-cover" src={person.imageUrl} alt={person.name} fill={true} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200">{person.name}</p>
                  <p className="w-56 truncate text-sm font-medium text-zinc-500">{person.role}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2"
                >
                  <PlusIcon className="-ml-1 h-5 w-5" />
                  <span className="text-sm font-medium text-zinc-300">Follow</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 bg-clip-text text-sm font-bold text-transparent">
          Explore more →
        </button>
      </div>
    </div>
  );
}
