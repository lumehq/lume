import { message } from '@tauri-apps/plugin-dialog';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';
import { WidgetKinds } from '@stores/widgets';

const data = [
  { hashtag: '#bitcoin' },
  { hashtag: '#nostr' },
  { hashtag: '#nostrdesign' },
  { hashtag: '#zap' },
  { hashtag: '#LFG' },
  { hashtag: '#zapchain' },
  { hashtag: '#plebchain' },
  { hashtag: '#nodes' },
  { hashtag: '#hodl' },
  { hashtag: '#stacksats' },
  { hashtag: '#nokyc' },
  { hashtag: '#meme' },
  { hashtag: '#memes' },
  { hashtag: '#memestr' },
  { hashtag: '#penisbutter' },
  { hashtag: '#anime' },
  { hashtag: '#waifu' },
  { hashtag: '#manga' },
  { hashtag: '#nostriches' },
  { hashtag: '#dev' },
];

export function OnboardStep2Screen() {
  const navigate = useNavigate();

  const [setStep, clearStep] = useOnboarding((state) => [state.setStep, state.clearStep]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(new Set<string>());

  const { db } = useStorage();

  const toggleTag = (tag: string) => {
    if (tags.has(tag)) {
      setTags((prev) => {
        prev.delete(tag);
        return new Set(prev);
      });
    } else {
      if (tags.size >= 3) return;
      setTags((prev) => new Set(prev.add(tag)));
    }
  };

  const skip = async () => {
    // update last login
    await db.updateLastLogin();

    // clear local storage
    clearStep();

    navigate('/auth/complete', { replace: true });
  };

  const submit = async () => {
    try {
      setLoading(true);

      for (const tag of tags) {
        await db.createWidget(WidgetKinds.global.hashtag, tag, tag.replace('#', ''));
      }

      // update last login
      await db.updateLastLogin();

      // clear local storage
      clearStep();

      navigate('/auth/complete', { replace: true });
    } catch (e) {
      setLoading(false);
      await message(e, { title: 'Lume', type: 'error' });
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/onboarding/step-2');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4 border-b border-white/10 pb-4">
        <h1 className="mb-2 text-center text-2xl font-semibold text-white">
          Choose {tags.size}/3 your favorite hashtags
        </h1>
        <p className="text-white/70">
          Hashtags are an easy way to discover more content. By adding a hashtag, Lume
          will show all related posts. You can always add more later.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex h-[450px] w-full flex-col divide-y divide-white/5 overflow-y-auto rounded-xl bg-white/20 backdrop-blur-xl scrollbar-none">
          {data.map((item: { hashtag: string }) => (
            <button
              key={item.hashtag}
              type="button"
              onClick={() => toggleTag(item.hashtag)}
              className="inline-flex transform items-center justify-between px-4 py-2 hover:bg-white/10"
            >
              <p className="text-white">{item.hashtag}</p>
              {tags.has(item.hashtag) && (
                <div>
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={loading || tags.size === 0 || tags.size > 3}
            className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg border-t border-white/10 bg-blue-500 px-6 font-medium leading-none text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
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
                <span>Add {tags.size} tags & Continue</span>
                <ArrowRightCircleIcon className="h-5 w-5" />
              </>
            )}
          </button>
          {!loading ? (
            <button
              type="button"
              onClick={() => skip()}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg border-t border-white/10 bg-white/20 font-medium leading-none text-white backdrop-blur-xl hover:bg-white/30 focus:outline-none"
            >
              Skip, you can add later
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
