import { NDKEvent, NDKUserProfile } from '@nostr-dev-kit/ndk';
import * as Dialog from '@radix-ui/react-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useStorage } from '@libs/storage/provider';

import { AvatarUploader } from '@shared/avatarUploader';
import { BannerUploader } from '@shared/bannerUploader';
import { CancelIcon, CheckCircleIcon, LoaderIcon, UnverifiedIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { useNostr } from '@utils/hooks/useNostr';

interface NIP05 {
  names: {
    [key: string]: string;
  };
}

export function EditProfileModal() {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState('https://void.cat/d/5VKmKyuHyxrNMf9bWSVPih');
  const [banner, setBanner] = useState(null);
  const [nip05, setNIP05] = useState({ verified: false, text: '' });

  const { db } = useStorage();
  const { publish } = useNostr();
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

  const verifyNIP05 = async (nip05: string) => {
    const localPath = nip05.split('@')[0];
    const service = nip05.split('@')[1];
    const verifyURL = `https://${service}/.well-known/nostr.json?name=${localPath}`;

    const res = await fetch(verifyURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch NIP-05 service: ${nip05}`);

    const data: NIP05 = await res.json();
    if (data.names) {
      if (data.names[localPath] !== db.account.pubkey) return false;
      return true;
    }
    return false;
  };

  const onSubmit = async (data: NDKUserProfile) => {
    // start loading
    setLoading(true);

    let event: NDKEvent;

    const content = {
      ...data,
      username: data.name,
      display_name: data.name,
      bio: data.about,
      image: data.picture,
    };

    if (data.nip05) {
      const nip05IsVerified = await verifyNIP05(data.nip05);
      if (nip05IsVerified) {
        event = await publish({
          content: JSON.stringify({ ...content, nip05: data.nip05 }),
          kind: 0,
          tags: [],
        });
      } else {
        setNIP05((prev) => ({ ...prev, verified: false }));
        setError('nip05', {
          type: 'manual',
          message: "Can't verify your Lume ID / NIP-05, please check again",
        });
      }
    } else {
      event = await publish({
        content: JSON.stringify(content),
        kind: 0,
        tags: [],
      });
    }

    if (event.id) {
      // invalid cache
      queryClient.invalidateQueries(['user', db.account.pubkey]);
      // reset form
      reset();
      // reset state
      setLoading(false);
      setIsOpen(false);
      setPicture('https://void.cat/d/5VKmKyuHyxrNMf9bWSVPih');
      setBanner(null);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!nip05.verified && /\S+@\S+\.\S+/.test(nip05.text)) {
      verifyNIP05(nip05.text);
    }
  }, [nip05.text]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-neutral-200 text-sm font-medium text-neutral-900 backdrop-blur-xl hover:bg-blue-600 hover:text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-blue-600 dark:hover:text-neutral-100"
        >
          Edit profile
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-white dark:bg-black" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-neutral-100 dark:bg-neutral-900">
            <div className="h-min w-full shrink-0 rounded-t-xl border-b border-neutral-200 px-5 py-5 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold leading-none text-neutral-900 dark:text-neutral-100">
                  Edit profile
                </Dialog.Title>
                <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-900 hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-800">
                  <CancelIcon className="h-4 w-4" />
                </Dialog.Close>
              </div>
            </div>
            <div className="flex h-full w-full flex-col overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="mb-0">
                <input type={'hidden'} {...register('picture')} value={picture} />
                <input type={'hidden'} {...register('banner')} value={banner} />
                <div className="relative">
                  <div className="relative h-44 w-full">
                    {banner ? (
                      <img
                        src={banner}
                        alt="user's banner"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-black dark:bg-white" />
                    )}
                    <div className="absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 transform">
                      <BannerUploader setBanner={setBanner} />
                    </div>
                  </div>
                  <div className="mb-5 px-4">
                    <div className="relative z-10 -mt-7 h-14 w-14">
                      <Image
                        src={picture}
                        alt="user's avatar"
                        className="h-14 w-14 rounded-lg object-cover ring-2 ring-neutral-900"
                      />
                      <div className="absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 transform">
                        <AvatarUploader setPicture={setPicture} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 px-4 pb-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
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
                      className="relative h-11 w-full rounded-lg bg-neutral-200 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="nip05"
                      className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
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
                        className="relative h-11 w-full rounded-lg bg-neutral-200 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-800 dark:text-neutral-100"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
                        {nip05.verified ? (
                          <span className="inline-flex h-6 items-center gap-1 rounded bg-green-500 px-2 text-sm font-medium text-white">
                            <CheckCircleIcon className="h-4 w-4 text-black dark:text-white" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex h-6 items-center gap-1 rounded bg-red-500 px-2 text-sm font-medium text-white">
                            <UnverifiedIcon className="h-4 w-4 text-black dark:text-white" />
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
                      htmlFor="about"
                      className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                    >
                      Bio
                    </label>
                    <textarea
                      {...register('about')}
                      spellCheck={false}
                      className="relative h-20 w-full resize-none rounded-lg bg-neutral-200 px-3 py-2 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="website"
                      className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                    >
                      Website
                    </label>
                    <input
                      type={'text'}
                      {...register('website', { required: false })}
                      spellCheck={false}
                      className="relative h-11 w-full rounded-lg bg-neutral-200 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="website"
                      className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                    >
                      Lightning address
                    </label>
                    <input
                      type={'text'}
                      {...register('lud16', { required: false })}
                      spellCheck={false}
                      className="relative h-11 w-full rounded-lg bg-neutral-200 px-3 py-1 text-neutral-900 !outline-none backdrop-blur-xl placeholder:text-neutral-500 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={!isValid}
                      className="inline-flex h-11 w-full transform items-center justify-center gap-1 rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600 focus:outline-none active:translate-y-1 disabled:pointer-events-none disabled:opacity-50"
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
