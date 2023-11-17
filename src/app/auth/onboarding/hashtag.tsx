import { message } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeftIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';

import { TOPICS, WIDGET_KIND } from '@stores/constants';
import { useOnboarding } from '@stores/onboarding';

import { useWidget } from '@utils/hooks/useWidget';

export function OnboardHashtagScreen() {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState(null);

  const navigate = useNavigate();
  const setHashtag = useOnboarding((state) => state.toggleHashtag);

  const { addWidget } = useWidget();

  const submit = async () => {
    try {
      setLoading(true);
      setHashtag();

      addWidget.mutate({
        kind: WIDGET_KIND.topic,
        title: topic.title,
        content: JSON.stringify(topic.content),
      });

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
          Choose your favorite topic
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-3">
            {TOPICS.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setTopic(item)}
                className="inline-flex h-14 items-center justify-between rounded-xl bg-neutral-100 px-4 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                <p className="font-medium">{item.title}</p>
                {topic && topic.title === item.title && (
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
            disabled={loading || !topic}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <span>Add & Continue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
