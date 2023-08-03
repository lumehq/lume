import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AvatarUploader } from '@shared/avatarUploader';
import { BannerUploader } from '@shared/bannerUploader';
import { LoaderIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';
import { useOnboarding } from '@stores/onboarding';

export function CreateStep3Screen() {
  const navigate = useNavigate();
  const createProfile = useOnboarding((state) => state.createProfile);

  const [picture, setPicture] = useState(DEFAULT_AVATAR);
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm();

  const onSubmit = (data: { name: string; about: string }) => {
    setLoading(true);
    try {
      const profile = {
        ...data,
        username: data.name,
        name: data.name,
        display_name: data.name,
        bio: data.about,
      };
      createProfile(profile);
      // redirect to next step
      setTimeout(() => navigate('/auth/create/step-4', { replace: true }), 1200);
    } catch {
      console.log('error');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-white">Create your profile</h1>
      </div>
      <div className="w-full overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col">
          <input
            type={'hidden'}
            {...register('picture')}
            value={picture}
            className="shadow-input relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-black/5 !outline-none placeholder:text-white/50 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
          />
          <input
            type={'hidden'}
            {...register('banner')}
            value={banner}
            className="shadow-input relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-black/5 !outline-none placeholder:text-white/50 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
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
                Name *
              </label>
              <input
                type={'text'}
                {...register('name', {
                  required: true,
                  minLength: 4,
                })}
                spellCheck={false}
                className="relative h-10 w-full rounded-lg bg-zinc-800 px-3 py-2 text-white !outline-none placeholder:text-zinc-500"
              />
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
                className="relative h-20 w-full resize-none rounded-lg bg-zinc-800 px-3 py-2 text-white !outline-none placeholder:text-zinc-500"
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
                {...register('website', {
                  required: false,
                })}
                spellCheck={false}
                className="relative h-10 w-full rounded-lg bg-zinc-800 px-3 py-2 text-white !outline-none placeholder:text-zinc-500"
              />
            </div>
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-fuchsia-500 font-medium text-white hover:bg-fuchsia-600"
            >
              {loading ? (
                <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-white" />
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
