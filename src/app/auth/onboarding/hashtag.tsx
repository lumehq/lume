import { message } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeftIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';

import { HASHTAGS } from '@stores/constants';
import { useOnboarding } from '@stores/onboarding';

export function OnboardHashtagScreen() {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(new Set<string>());

  const navigate = useNavigate();
  const setHashtag = useOnboarding((state) => state.toggleHashtag);

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

      setHashtag();
      navigate(-1);
    } catch (e) {
      setLoading(false);
      await message(e, { title: 'Lume', type: 'error' });
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      <div className="absolute left-[8px] top-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium"
        >
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            <ArrowLeftIcon className="h-5 w-5" />
          </div>
          Back
        </button>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-3">
        <h1 className="text-center text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Choose {tags.size}/3 your favorite hashtag
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex h-[420px] w-full flex-col overflow-y-auto rounded-xl bg-neutral-100 dark:bg-neutral-900">
            {HASHTAGS.map((item: { hashtag: string }) => (
              <button
                key={item.hashtag}
                type="button"
                onClick={() => toggleTag(item.hashtag)}
                className="inline-flex items-center justify-between px-4 py-2 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <p className="text-neutral-900 dark:text-neutral-100">{item.hashtag}</p>
                {tags.has(item.hashtag) && (
                  <div>
                    <CheckCircleIcon className="h-5 w-5 text-teal-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={loading || tags.size === 0}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <span>Add {tags.size} tags & Continue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
