import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AvatarUploader } from '@shared/avatarUploader';
import { BannerUploader } from '@shared/bannerUploader';
import { LoaderIcon } from '@shared/icons';
import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { usePublish } from '@utils/hooks/usePublish';

export function CreateStep3Screen() {
  const { publish } = usePublish();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState(DEFAULT_AVATAR);
  const [banner, setBanner] = useState('');

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm();

  const onSubmit = async (data: { name: string; about: string; website: string }) => {
    setLoading(true);
    try {
      const profile = {
        ...data,
        name: data.name,
        display_name: data.name,
        bio: data.about,
        website: data.website,
      };

      const event = await publish({
        content: JSON.stringify(profile),
        kind: 0,
        tags: [],
      });

      queryClient.invalidateQueries(['currentAccount']);

      if (event) {
        setTimeout(() => navigate('/auth/onboarding', { replace: true }), 1000);
      }
    } catch (e) {
      console.log('error: ', e);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-white">Create your profile</h1>
      </div>
      <div className="w-full overflow-hidden rounded-xl bg-white/10">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col">
          <input type={'hidden'} {...register('picture')} value={picture} />
          <input type={'hidden'} {...register('banner')} value={banner} />
          <div className="relative">
            <div className="relative h-44 w-full bg-white/10">
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
                  className="h-14 w-14 rounded-lg object-cover ring-2 ring-white/10"
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
                className="relative h-11 w-full rounded-lg bg-white/10 px-3 py-1 text-white !outline-none placeholder:text-white/50"
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
                className="relative h-20 w-full resize-none rounded-lg bg-white/10 px-3 py-1 text-white !outline-none placeholder:text-white/50"
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
                className="relative h-11 w-full rounded-lg bg-white/10 px-3 py-1 text-white !outline-none placeholder:text-white/50"
              />
            </div>
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none"
            >
              {loading ? (
                <>
                  <span className="w-5" />
                  <span>Creating...</span>
                  <LoaderIcon className="h-5 w-5 animate-spin text-white" />
                </>
              ) : (
                <>
                  <span className="w-5" />
                  <span>Continue</span>
                  <ArrowRightCircleIcon className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
