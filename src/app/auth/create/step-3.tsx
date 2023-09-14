import { NDKKind } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AvatarUploader } from '@shared/avatarUploader';
import { BannerUploader } from '@shared/bannerUploader';
import { LoaderIcon } from '@shared/icons';
import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';
import { Image } from '@shared/image';

import { useOnboarding } from '@stores/onboarding';

import { useNostr } from '@utils/hooks/useNostr';

export function CreateStep3Screen() {
  const navigate = useNavigate();
  const setStep = useOnboarding((state) => state.setStep);

  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState('https://void.cat/d/5VKmKyuHyxrNMf9bWSVPih');
  const [banner, setBanner] = useState('');

  const { publish } = useNostr();
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
        kind: NDKKind.Metadata,
        tags: [],
      });

      if (event) {
        navigate('/auth/onboarding', { replace: true });
      }
    } catch (e) {
      console.log('error: ', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/create/step-3');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4 border-b border-white/10 pb-4">
        <h1 className="mb-2 text-center text-2xl font-semibold text-white">
          Personalize your Nostr profile
        </h1>
        <p className="text-white/70">
          Nostr profile is synchronous across all Nostr clients. If you create a profile
          on Lume, it will also work well with other Nostr clients. If you update your
          profile on another Nostr client, it will also sync to Lume.
        </p>
      </div>
      <div className="w-full overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col">
          <input type={'hidden'} {...register('picture')} value={picture} />
          <input type={'hidden'} {...register('banner')} value={banner} />
          <div className="relative">
            <div className="relative h-36 w-full bg-white/10 backdrop-blur-xl">
              {banner ? (
                <Image
                  src={banner}
                  alt="user's banner"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-white/20" />
              )}
              <div className="absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 transform">
                <BannerUploader setBanner={setBanner} />
              </div>
            </div>
            <div className="mb-5 px-4">
              <div className="relative z-10 -mt-8 h-16 w-16">
                <Image
                  src={picture}
                  alt="user's avatar"
                  className="h-16 w-16 rounded-lg object-cover ring-2 ring-white/20"
                />
                <div className="absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 transform">
                  <AvatarUploader setPicture={setPicture} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 pb-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-medium text-white">
                Name *
              </label>
              <input
                type={'text'}
                {...register('name', {
                  required: true,
                  minLength: 4,
                })}
                spellCheck={false}
                className="relative h-12 w-full rounded-lg bg-white/20 px-3 py-1 text-white !outline-none backdrop-blur-xl placeholder:text-white/70"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="about" className="font-medium text-white">
                Bio
              </label>
              <textarea
                {...register('about')}
                spellCheck={false}
                className="relative h-20 w-full resize-none rounded-lg bg-white/20 px-3 py-2 text-white !outline-none backdrop-blur-xl placeholder:text-white/70"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="website" className="font-medium text-white">
                Website
              </label>
              <input
                {...register('website', {
                  required: false,
                })}
                spellCheck={false}
                className="relative h-12 w-full rounded-lg bg-white/20 px-3 py-1 text-white !outline-none backdrop-blur-xl placeholder:text-white/70"
              />
            </div>
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg border-t border-white/10 bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none"
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
