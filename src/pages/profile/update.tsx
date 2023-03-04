import BaseLayout from '@layouts/baseLayout';
import UserLayout from '@layouts/userLayout';

import { RelayContext } from '@components/contexts/relay';

import { dateToUnix } from '@utils/getDate';

import { useLocalStorage } from '@rehooks/local-storage';
import { useRouter } from 'next/router';
import { getEventHash, signEvent } from 'nostr-tools';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Database from 'tauri-plugin-sql-api';

type FormValues = {
  display_name: string;
  name: string;
  username: string;
  picture: string;
  banner: string;
  about: string;
  website: string;
};

// TODO: update the design
export default function Page() {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [currentUser]: any = useLocalStorage('current-user');
  const profile =
    currentUser.metadata !== undefined ? JSON.parse(currentUser.metadata) : { display_name: null, username: null };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>();

  const onSubmit = async (data: any) => {
    setLoading(true);

    // publish account to relays
    const event: any = {
      content: JSON.stringify(data),
      created_at: dateToUnix(),
      kind: 0,
      pubkey: currentUser.pubkey,
      tags: [],
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, currentUser.privkey);

    relayPool.publish(event, relays);

    // save account to database
    const db = await Database.load('sqlite:lume.db');
    await db.execute(`UPDATE accounts SET metadata = '${JSON.stringify(data)}' WHERE pubkey = "${currentUser.pubkey}"`);

    // set currentUser in global state
    currentUser.set({
      metadata: JSON.stringify(data),
      npub: currentUser.npub,
      privkey: currentUser.privkey,
      pubkey: currentUser.pubkey,
    });

    // redirect to newsfeed
    setTimeout(() => {
      setLoading(false);
      router.reload();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-full w-full flex-col justify-between px-6">
      <div className="mb-8 flex flex-col gap-3 pt-8">
        <h1 className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent">
          Update profile
        </h1>
        <h2 className="w-3/4 text-zinc-400">
          Your profile will be published to all relays, as long as you have the private key, you always can recover your
          profile in any client
        </h2>
      </div>
      <fieldset className="flex flex-col gap-2">
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <label className="text-zinc-300">Display Name</label>
          </div>
          <div className="col-span-3 flex flex-col gap-2">
            <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <input
                {...register('display_name')}
                defaultValue={profile.display_name || ''}
                className="relative w-full rounded-lg border border-black/5 px-3.5 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
              />
            </div>
            <span className="text-sm text-red-400">{errors.display_name && <p>{errors.display_name.message}</p>}</span>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <label className="text-zinc-300">Name</label>
          </div>
          <div className="col-span-3 flex flex-col gap-2">
            <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <input
                {...register('name')}
                defaultValue={profile.name || ''}
                className="relative w-full rounded-lg border border-black/5 px-3.5 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
              />
            </div>
            <span className="text-sm text-red-400">{errors.name && <p>{errors.name.message}</p>}</span>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <label className="text-zinc-300">Username</label>
          </div>
          <div className="col-span-3 flex flex-col gap-2">
            <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <input
                {...register('username')}
                defaultValue={profile.username || ''}
                className="relative w-full rounded-lg border border-black/5 px-3.5 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
              />
            </div>
            <span className="text-sm text-red-400">{errors.username && <p>{errors.username.message}</p>}</span>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <label className="text-zinc-300">Profile Picture</label>
          </div>
          <div className="col-span-3 flex flex-col gap-2">
            <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <input
                {...register('picture')}
                defaultValue={profile.picture || ''}
                className="relative w-full rounded-lg border border-black/5 px-3.5 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
              />
            </div>
            <span className="text-sm text-red-400">{errors.picture && <p>{errors.picture.message}</p>}</span>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <label className="text-zinc-300">Banner</label>
          </div>
          <div className="col-span-3 flex flex-col gap-2">
            <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <input
                {...register('banner')}
                defaultValue={profile.banner || ''}
                className="relative w-full rounded-lg border border-black/5 px-3.5 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
              />
            </div>
            <span className="text-sm text-red-400">{errors.banner && <p>{errors.banner.message}</p>}</span>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <label className="text-zinc-300">About</label>
          </div>
          <div className="col-span-3 flex flex-col gap-2">
            <div className="relative h-24 shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <textarea
                {...register('about')}
                defaultValue={profile.about || ''}
                className="relative h-24 w-full resize-none rounded-lg border border-black/5 px-3.5 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
              />
            </div>
            <span className="text-sm text-red-400">{errors.about && <p>{errors.about.message}</p>}</span>
          </div>
        </div>
      </fieldset>
      <div className="pb-5">
        <div className="flex h-10 items-center">
          {loading === true ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="transform rounded-lg bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 px-3.5 py-2 font-medium active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span className="drop-shadow-lg">Update</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return (
    <BaseLayout>
      <UserLayout>{page}</UserLayout>
    </BaseLayout>
  );
};
