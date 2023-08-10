import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { createBlock } from '@libs/storage';

import { ArrowRightCircleIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';

import { BLOCK_KINDS } from '@stores/constants';
import { useOnboarding } from '@stores/onboarding';

const data = [
  { hashtag: '#bitcoin' },
  { hashtag: '#nostr' },
  { hashtag: '#zap' },
  { hashtag: '#LFG' },
  { hashtag: '#zapchain' },
  { hashtag: '#plebchain' },
  { hashtag: '#nodes' },
  { hashtag: '#hodl' },
  { hashtag: '#stacksats' },
  { hashtag: '#nokyc' },
  { hashtag: '#anime' },
  { hashtag: '#waifu' },
  { hashtag: '#manga' },
  { hashtag: '#nostriches' },
  { hashtag: '#dev' },
];

export function OnboardStep2Screen() {
  const navigate = useNavigate();
  const setStep = useOnboarding((state) => state.setStep);

  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(new Set<string>());

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

  const submit = async () => {
    try {
      setLoading(true);

      for (const tag of tags) {
        await createBlock(BLOCK_KINDS.hashtag, tag, tag.replace('#', ''));
      }

      setTimeout(() => navigate('/auth/onboarding/step-3', { replace: true }), 1000);
    } catch {
      console.log('error');
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/onboarding/step-2');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-white">
          Choose {tags.size}/3 your favorite tags
        </h1>
        <p className="text-sm text-white/50">Customize your space which hashtag widget</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="scrollbar-hide flex h-[500px] w-full flex-col overflow-y-auto rounded-xl bg-white/10">
          {data.map((item: { hashtag: string }) => (
            <button
              key={item.hashtag}
              type="button"
              onClick={() => toggleTag(item.hashtag)}
              className="inline-flex transform items-center justify-between bg-white/10 px-4 py-2 hover:bg-white/20"
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
            className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none disabled:opacity-50"
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
          <Link
            to="/auth/onboarding/step-3"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg px-6 font-medium leading-none text-white hover:bg-white/10 focus:outline-none"
          >
            Skip, you can add later
          </Link>
        </div>
      </div>
    </div>
  );
}
