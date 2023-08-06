import { Dialog, Transition } from '@headlessui/react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQueryClient } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { AvatarUploader } from '@shared/avatarUploader';
import { BannerUploader } from '@shared/bannerUploader';
import { CancelIcon, CheckCircleIcon, LoaderIcon, UnverifiedIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useAccount } from '@utils/hooks/useAccount';
import { usePublish } from '@utils/hooks/usePublish';

export function EditProfileModal() {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState(DEFAULT_AVATAR);
  const [banner, setBanner] = useState('');
  const [nip05, setNIP05] = useState({ verified: false, text: '' });

  const { publish } = usePublish();
  const { account } = useAccount();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: async () => {
      const res: any = queryClient.getQueryData(['user', account.pubkey]);
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

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const verifyNIP05 = async (data: string) => {
    if (data) {
      const url = data.split('@');
      const username = url[0];
      const service = url[1];
      const verifyURL = `https://${service}/.well-known/nostr.json?name=${username}`;

      const res: any = await fetch(verifyURL, {
        method: 'GET',
        timeout: 30,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

      if (!res.ok) return false;
      if (res.data.names[username] === account.pubkey) {
        setNIP05((prev) => ({ ...prev, verified: true }));
        return true;
      } else {
        return false;
      }
    }
  };

  const onSubmit = async (data: any) => {
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
      const verify = await verifyNIP05(data.nip05);
      if (verify) {
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
      setTimeout(() => {
        // invalid cache
        queryClient.invalidateQueries(['user', account.pubkey]);
        // reset form
        reset();
        // reset state
        setLoading(false);
        setIsOpen(false);
        setPicture(DEFAULT_AVATAR);
        setBanner(null);
      }, 1200);
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
    <>
      <button
        type="button"
        onClick={() => openModal()}
        className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
      >
        Edit profile
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-md" />
          </Transition.Child>
          <div className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col rounded-lg border-t border-zinc-800/50 bg-zinc-900">
                <div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-5">
                  <div className="flex items-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-none text-white"
                    >
                      Edit profile
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
                    >
                      <CancelIcon className="h-5 w-5 text-zinc-300" />
                    </button>
                  </div>
                </div>
                <div className="flex h-full w-full flex-col overflow-y-auto">
                  <form onSubmit={handleSubmit(onSubmit)} className="mb-0">
                    <input
                      type={'hidden'}
                      {...register('picture')}
                      value={picture}
                      className="shadow-input relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-black/5 !outline-none placeholder:text-white/50 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-white/50"
                    />
                    <input
                      type={'hidden'}
                      {...register('banner')}
                      value={banner}
                      className="shadow-input relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-black/5 !outline-none placeholder:text-white/50 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-white/50"
                    />
                    <div className="relative">
                      <div className="relative h-44 w-full bg-zinc-800">
                        <Image
                          src={banner}
                          fallback="https://void.cat/d/QY1myro5tkHVs2nY7dy74b.jpg"
                          alt="user's banner"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 transform">
                          <BannerUploader setBanner={setBanner} />
                        </div>
                      </div>
                      <div className="mb-5 px-4">
                        <div className="relative z-10 -mt-7 h-14 w-14">
                          <Image
                            src={picture}
                            fallback={DEFAULT_AVATAR}
                            alt="user's avatar"
                            className="h-14 w-14 rounded-lg object-cover ring-2 ring-zinc-900"
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
                          className="text-sm font-semibold uppercase tracking-wider text-white/50"
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
                          className="relative h-10 w-full rounded-lg bg-zinc-800 px-3 py-2 text-white !outline-none placeholder:text-white/50"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="nip05"
                          className="text-sm font-semibold uppercase tracking-wider text-white/50"
                        >
                          Lume ID / NIP-05
                        </label>
                        <div className="relative">
                          <input
                            {...register('nip05', {
                              required: true,
                              minLength: 4,
                            })}
                            spellCheck={false}
                            className="relative h-10 w-full rounded-lg bg-zinc-800 px-3 py-2 text-white !outline-none placeholder:text-white/50"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
                            {nip05.verified ? (
                              <span className="inline-flex h-6 items-center gap-1 rounded bg-green-500 px-2 text-sm font-medium">
                                <CheckCircleIcon className="h-4 w-4 text-white" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex h-6 items-center gap-1 rounded bg-red-500 px-2 text-sm font-medium">
                                <UnverifiedIcon className="h-4 w-4 text-white" />
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
                          className="text-sm font-semibold uppercase tracking-wider text-white/50"
                        >
                          Bio
                        </label>
                        <textarea
                          {...register('about')}
                          spellCheck={false}
                          className="relative h-20 w-full resize-none rounded-lg bg-zinc-800 px-3 py-2 text-white !outline-none placeholder:text-white/50"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="website"
                          className="text-sm font-semibold uppercase tracking-wider text-white/50"
                        >
                          Website
                        </label>
                        <input
                          type={'text'}
                          {...register('website', { required: false })}
                          spellCheck={false}
                          className="relative h-10 w-full rounded-lg bg-zinc-800 px-3 py-2 text-white !outline-none placeholder:text-white/50"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="website"
                          className="text-sm font-semibold uppercase tracking-wider text-white/50"
                        >
                          Lightning address
                        </label>
                        <input
                          type={'text'}
                          {...register('lud16', { required: false })}
                          spellCheck={false}
                          className="relative h-10 w-full rounded-lg bg-zinc-800 px-3 py-2 text-white !outline-none placeholder:text-white/50"
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={!isValid}
                          className="inline-flex h-11 w-full transform items-center justify-center gap-1 rounded-md bg-fuchsia-500 font-medium text-white hover:bg-fuchsia-600 focus:outline-none active:translate-y-1 disabled:pointer-events-none disabled:opacity-50"
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
