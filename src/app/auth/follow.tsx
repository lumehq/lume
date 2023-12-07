import { NDKKind } from '@nostr-dev-kit/ndk';
import * as Accordion from '@radix-ui/react-accordion';
import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { useArk } from '@libs/ark';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CancelIcon,
  ChevronDownIcon,
  LoaderIcon,
  PlusIcon,
} from '@shared/icons';
import { User } from '@shared/user';

const POPULAR_USERS = [
  'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6',
  'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m',
  'npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s',
  'npub1gcxzte5zlkncx26j68ez60fzkvtkm9e0vrwdcvsjakxf9mu9qewqlfnj5z',
  'npub1az9xj85cmxv8e9j9y80lvqp97crsqdu2fpu3srwthd99qfu9qsgstam8y8',
  'npub1a2cww4kn9wqte4ry70vyfwqyqvpswksna27rtxd8vty6c74era8sdcw83a',
  'npub168ghgug469n4r2tuyw05dmqhqv5jcwm7nxytn67afmz8qkc4a4zqsu2dlc',
  'npub133vj8ycevdle0cq8mtgddq0xtn34kxkwxvak983dx0u5vhqnycyqj6tcza',
  'npub18ams6ewn5aj2n3wt2qawzglx9mr4nzksxhvrdc4gzrecw7n5tvjqctp424',
  'npub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac',
  'npub1prya33fnqerq0fljwjtp77ehtu7jlsjt5ydhwveuwmqdsdm6k8esk42xcv',
  'npub19mduaf5569jx9xz555jcx3v06mvktvtpu0zgk47n4lcpjsz43zzqhj6vzk',
];
const LUME_USERS = ['npub1zfss807aer0j26mwp2la0ume0jqde3823rmu97ra6sgyyg956e0s6xw445'];

export function FollowScreen() {
  const { ark } = useArk();
  const { status, data } = useQuery({
    queryKey: ['trending-profiles-widget'],
    queryFn: async () => {
      const res = await fetch('https://api.nostr.band/v0/trending/profiles');
      if (!res.ok) {
        throw new Error('Error');
      }
      return res.json();
    },
  });

  const [loading, setLoading] = useState(false);
  const [follows, setFollows] = useState<string[]>([]);

  const navigate = useNavigate();

  // toggle follow state
  const toggleFollow = (pubkey: string) => {
    const arr = follows.includes(pubkey)
      ? follows.filter((i) => i !== pubkey)
      : [...follows, pubkey];
    setFollows(arr);
  };

  const submit = async () => {
    try {
      setLoading(true);
      if (!follows.length) return navigate('/auth/finish');

      const publish = await ark.createEvent({
        kind: NDKKind.Contacts,
        tags: follows.map((item) => {
          if (item.startsWith('npub')) return ['p', nip19.decode(item).data as string];
          return ['p', item];
        }),
      });

      if (publish) {
        ark.account.contacts = follows.map((item) => {
          if (item.startsWith('npub')) return nip19.decode(item).data as string;
          return item;
        });

        return navigate('/auth/finish');
      }
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Dive into the nostrverse</h1>
          <h2 className="text-neutral-700 dark:text-neutral-300">
            Try following some users that interest you
            <br />
            to build up your timeline.
          </h2>
        </div>
        <Accordion.Root type="single" defaultValue="recommended" collapsible>
          <Accordion.Item value="recommended" className="mb-3 overflow-hidden rounded-xl">
            <Accordion.Trigger className="flex h-12 w-full items-center justify-between rounded-t-xl bg-neutral-100 px-3 font-medium dark:bg-neutral-900">
              Popular users
              <ChevronDownIcon className="h-4 w-4" />
            </Accordion.Trigger>
            <Accordion.Content>
              <div className="flex h-[420px] w-full flex-col gap-3 overflow-y-auto rounded-b-xl bg-neutral-50 p-3 dark:bg-neutral-950">
                {POPULAR_USERS.map((pubkey) => (
                  <div
                    key={pubkey}
                    className="flex h-max w-full shrink-0 flex-col overflow-hidden rounded-lg border border-neutral-100 bg-white dark:border-neutral-900 dark:bg-black"
                  >
                    <div className="p-3">
                      <User pubkey={pubkey} variant="large" />
                    </div>
                    <div className="border-t border-neutral-100 px-3 py-4 dark:border-neutral-900">
                      <button
                        type="button"
                        onClick={() => toggleFollow(pubkey)}
                        className={twMerge(
                          'inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg font-medium text-white',
                          follows.includes(pubkey)
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        )}
                      >
                        {follows.includes(pubkey) ? (
                          <>
                            <CancelIcon className="h-4 w-4" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-4 w-4" />
                            Follow
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="trending" className="mb-3 overflow-hidden rounded-xl">
            <Accordion.Trigger className="flex h-12 w-full items-center justify-between rounded-t-xl bg-neutral-100 px-3 font-medium dark:bg-neutral-900">
              Trending users
              <ChevronDownIcon className="h-4 w-4" />
            </Accordion.Trigger>
            <Accordion.Content>
              <div className="flex h-[420px] w-full flex-col gap-3 overflow-y-auto rounded-b-xl bg-neutral-50 p-3 dark:bg-neutral-950">
                {status === 'pending' ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  data?.profiles.map(
                    (item: { pubkey: string; profile: { content: string } }) => (
                      <div
                        key={item.pubkey}
                        className="flex h-max w-full shrink-0 flex-col overflow-hidden rounded-lg border border-neutral-100 bg-white dark:border-neutral-900 dark:bg-black"
                      >
                        <div className="p-3">
                          <User
                            pubkey={item.pubkey}
                            variant="large"
                            embedProfile={item.profile?.content}
                          />
                        </div>
                        <div className="border-t border-neutral-100 px-3 py-4 dark:border-neutral-900">
                          <button
                            type="button"
                            onClick={() => toggleFollow(item.pubkey)}
                            className={twMerge(
                              'inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg font-medium text-white',
                              follows.includes(item.pubkey)
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                            )}
                          >
                            {follows.includes(item.pubkey) ? (
                              <>
                                <CancelIcon className="h-4 w-4" />
                                Unfollow
                              </>
                            ) : (
                              <>
                                <PlusIcon className="h-4 w-4" />
                                Follow
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="lume" className="mb-3 overflow-hidden rounded-xl">
            <Accordion.Trigger className="flex h-12 w-full items-center justify-between rounded-t-xl bg-neutral-100 px-3 font-medium dark:bg-neutral-900">
              Lume team
              <ChevronDownIcon className="h-4 w-4" />
            </Accordion.Trigger>
            <Accordion.Content>
              <div className="flex h-[420px] w-full flex-col gap-3 overflow-y-auto rounded-b-xl bg-neutral-50 p-3 dark:bg-neutral-950">
                {LUME_USERS.map((pubkey) => (
                  <div
                    key={pubkey}
                    className="flex h-max w-full shrink-0 flex-col overflow-hidden rounded-lg border border-neutral-100 bg-white dark:border-neutral-900 dark:bg-black"
                  >
                    <div className="p-3">
                      <User pubkey={pubkey} variant="large" />
                    </div>
                    <div className="border-t border-neutral-100 px-3 py-4 dark:border-neutral-900">
                      <button
                        type="button"
                        onClick={() => toggleFollow(pubkey)}
                        className={twMerge(
                          'inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg font-medium text-white',
                          follows.includes(pubkey)
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        )}
                      >
                        {follows.includes(pubkey) ? (
                          <>
                            <CancelIcon className="h-4 w-4" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-4 w-4" />
                            Follow
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
      <div className="absolute bottom-3 right-3 flex w-full items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex h-11 w-max items-center justify-center gap-2 rounded-lg bg-neutral-100 px-3 font-semibold hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="inline-flex h-11 w-max items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 font-semibold text-white hover:bg-blue-600"
        >
          Continue
          {loading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRightIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
