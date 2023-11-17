import { NDKEvent, NDKKind, NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useQueryClient } from '@tanstack/react-query';
import { message } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { CheckCircleIcon, LoaderIcon, PlusIcon, UnverifiedIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function EditProfileScreen() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState('');
  const [banner, setBanner] = useState('');
  const [nip05, setNIP05] = useState({ verified: true, text: '' });

  const { db } = useStorage();
  const { ndk } = useNDK();
  const { upload } = useNostr();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: async () => {
      const res: NDKUserProfile = queryClient.getQueryData(['user', db.account.pubkey]);
      if (res.image) {
        setPicture(res.image);
      }
      if (res.banner) {
        setBanner(res.banner);
      }
      if (res.nip05) {
        setNIP05((prev) => ({ ...prev, text: res.nip05 }));
      }
      return res;
    },
  });

  const uploadAvatar = async () => {
    try {
      if (!ndk.signer) return navigate('/new/privkey');

      setLoading(true);

      const image = await upload();
      if (image) {
        setPicture(image);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      await message(`Upload failed, error: ${e}`, { title: 'Lume', type: 'error' });
    }
  };

  const uploadBanner = async () => {
    try {
      setLoading(true);

      const image = await upload();

      if (image) {
        setBanner(image);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      await message(`Upload failed, error: ${e}`, { title: 'Lume', type: 'error' });
    }
  };

  const onSubmit = async (data: NDKUserProfile) => {
    // start loading
    setLoading(true);

    const content = {
      ...data,
      username: data.name,
      display_name: data.name,
      bio: data.about,
      image: data.picture,
    };

    const event = new NDKEvent(ndk);
    event.kind = NDKKind.Metadata;
    event.tags = [];

    if (data.nip05) {
      const user = ndk.getUser({ pubkey: db.account.pubkey });
      const verify = await user.validateNip05(data.nip05);
      if (verify) {
        event.content = JSON.stringify({ ...content, nip05: data.nip05 });
      } else {
        setNIP05((prev) => ({ ...prev, verified: false }));
        setError('nip05', {
          type: 'manual',
          message: "Can't verify your Lume ID / NIP-05, please check again",
        });
      }
    } else {
      event.content = JSON.stringify(content);
    }

    const publishedRelays = await event.publish();

    if (publishedRelays) {
      // invalid cache
      queryClient.invalidateQueries({
        queryKey: ['user', db.account.pubkey],
      });
      // reset form
      reset();
      // reset state
      setLoading(false);
      setPicture(null);
      setBanner(null);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-0">
        <input type={'hidden'} {...register('picture')} value={picture} />
        <input type={'hidden'} {...register('banner')} value={banner} />
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-36 w-full">
            {banner ? (
              <img
                src={banner}
                alt="user's banner"
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-xl bg-neutral-200 dark:bg-neutral-900" />
            )}
            <div className="absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-xl">
              <button
                type="button"
                onClick={() => uploadBanner()}
                className="inline-flex h-full w-full items-center justify-center bg-black/20 text-white"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mb-5 px-4">
            <div className="relative z-10 -mt-7 h-14 w-14 overflow-hidden rounded-xl ring-2 ring-white dark:ring-black">
              <img
                src={picture}
                alt="user's avatar"
                className="h-14 w-14 rounded-xl object-cover"
              />
              <div className="absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 transform">
                <button
                  type="button"
                  onClick={() => uploadAvatar()}
                  className="inline-flex h-full w-full items-center justify-center rounded-xl bg-black/50 text-white"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="display_name"
              className="text-sm font-semibold uppercase tracking-wider"
            >
              Display Name
            </label>
            <input
              type={'text'}
              {...register('display_name', {
                required: true,
                minLength: 4,
              })}
              spellCheck={false}
              className="relative h-11 w-full rounded-lg bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="name"
              className="text-sm font-semibold uppercase tracking-wider"
            >
              Name
            </label>
            <input
              type={'text'}
              {...register('name', {
                required: true,
                minLength: 4,
              })}
              spellCheck={false}
              className="relative h-11 w-full rounded-lg bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="nip05"
              className="text-sm font-semibold uppercase tracking-wider"
            >
              NIP-05
            </label>
            <div className="relative">
              <input
                {...register('nip05', {
                  required: true,
                  minLength: 4,
                })}
                spellCheck={false}
                className="relative h-11 w-full rounded-lg bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-100"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
                {nip05.verified ? (
                  <span className="inline-flex h-6 items-center gap-1 rounded-full bg-teal-500 px-1 pr-1.5 text-xs font-medium text-white">
                    <CheckCircleIcon className="h-4 w-4" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex h-6 items-center gap-1 rounded bg-red-500 pl-1 pr-1.5 text-xs font-medium text-white">
                    <UnverifiedIcon className="h-4 w-4" />
                    Unverified
                  </span>
                )}
              </div>
              {errors.nip05 && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.nip05.message.toString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="website"
              className="text-sm font-semibold uppercase tracking-wider"
            >
              Website
            </label>
            <input
              type={'text'}
              {...register('website', { required: false })}
              spellCheck={false}
              className="relative h-11 w-full rounded-lg bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="website"
              className="text-sm font-semibold uppercase tracking-wider"
            >
              Lightning address
            </label>
            <input
              type={'text'}
              {...register('lud16', { required: false })}
              spellCheck={false}
              className="relative h-11 w-full rounded-lg bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="about"
              className="text-sm font-semibold uppercase tracking-wider"
            >
              Bio
            </label>
            <textarea
              {...register('about')}
              spellCheck={false}
              className="relative h-20 w-full resize-none rounded-lg bg-neutral-100 px-3 py-2 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={!isValid}
              className="mx-auto inline-flex h-9 w-full transform items-center justify-center gap-1 rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600 focus:outline-none active:translate-y-1 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-white" />
              ) : (
                'Update'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
