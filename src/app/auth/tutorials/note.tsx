import { NDKEvent } from '@nostr-dev-kit/ndk';
import { Link } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';

import { EditIcon, ReactionIcon, ReplyIcon, RepostIcon, ZapIcon } from '@shared/icons';
import { TextNote } from '@shared/notes';

export function TutorialNoteScreen() {
  const { ndk } = useNDK();
  const exampleEvent = new NDKEvent(ndk, {
    id: 'a3527670dd9b178bf7c2a9ea673b63bc8bfe774942b196691145343623c45821',
    pubkey: '04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9',
    created_at: 1701355223,
    kind: 1,
    tags: [],
    content: 'good morning nostr, stay humble and stack sats 🫡',
    sig: '9e0bd67ec25598744f20bff0fe360fdf190c4240edb9eea260e50f77e07f94ea767ececcc6270819b7f64e5e7ca1fe20b4971f46dc120e6db43114557f3a6dae',
  });

  return (
    <div className="flex h-full w-full select-text items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-10">
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
            <EditIcon className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-light">
            What is a <span className="font-bold">Note?</span>
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <p className="px-3">
            Posts on Nostr based Social Network client are usually called
            &apos;Notes.&apos; Notes are arranged chronologically on the timeline and are
            updated in real-time.
          </p>
          <p className="px-3 font-semibold">Here is one example:</p>
          <TextNote event={exampleEvent} className="pointer-events-none my-2" />
          <p className="px-3 font-semibold">Here are how you can interact with a note:</p>
          <div className="flex flex-col gap-2 px-3">
            <div className="inline-flex gap-3">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                <ReplyIcon className="h-5 w-5 text-blue-500" />
              </div>
              <p>
                Reply - Click on this button to reply to a note. It&apos;s also possible
                to reply to replies, continuing the conversation like a thread.
              </p>
            </div>
            <div className="inline-flex gap-3">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                <ReactionIcon className="h-5 w-5 text-red-500" />
              </div>
              <p>Reaction - You can add reactions to the Note to express your concern.</p>
            </div>
            <div className="inline-flex gap-3">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                <RepostIcon className="h-5 w-5 text-teal-500" />
              </div>
              <p>
                Repost - You can share that note to your own timeline. You can also quote
                them with your comments.
              </p>
            </div>
            <div className="inline-flex gap-3">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                <ZapIcon className="h-5 w-5 text-orange-500" />
              </div>
              <p>Zap - You can send tip in Bitcoin to that note owner with zero-fees</p>
            </div>
          </div>
          <div className="mt-5 flex gap-2 px-3">
            <Link
              to="/auth/finish"
              className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-neutral-100 font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              Back
            </Link>
            <Link
              to="/auth/tutorials/widget"
              className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
