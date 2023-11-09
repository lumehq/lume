import { Resolver, useForm } from 'react-hook-form';

import { ArrowRightCircleIcon, CancelIcon } from '@shared/icons';
import { WidgetWrapper } from '@shared/widgets';

import { HASHTAGS, WIDGET_KIND } from '@stores/constants';

import { useWidget } from '@utils/hooks/useWidget';
import { Widget } from '@utils/types';

type FormValues = {
  hashtag: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.hashtag ? values : {},
    errors: !values.hashtag
      ? {
          hashtag: {
            type: 'required',
            message: 'This is required.',
          },
        }
      : {},
  };
};

export function XhashtagWidget({ params }: { params: Widget }) {
  const { addWidget, removeWidget } = useWidget();
  const {
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: FormValues) => {
    try {
      addWidget.mutate({
        kind: WIDGET_KIND.global.hashtag,
        title: data.hashtag,
        content: data.hashtag.replace('#', ''),
      });
      // remove temp widget
      removeWidget.mutate(params.id);
    } catch (e) {
      setError('hashtag', {
        type: 'custom',
        message: e,
      });
    }
  };

  return (
    <WidgetWrapper>
      <div className="flex h-11 shrink-0 items-center justify-between px-3">
        <div className="w-6 shrink-0" />
        <h3 className="text-center font-semibold text-neutral-900 dark:text-neutral-100">
          Adding hashtag feeds
        </h3>
        <button
          type="button"
          onClick={() => removeWidget.mutate(params.id)}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-900 backdrop-blur-xl hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          <CancelIcon className="h-3 w-3" />
        </button>
      </div>
      <div className="flex flex-1 flex-col px-3">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <input
              {...register('hashtag', { required: true, minLength: 1 })}
              placeholder="Enter a hashtag"
              className="relative h-11 w-full rounded-lg bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none placeholder:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-300"
            />
            <span className="text-sm text-red-400">
              {errors.hashtag && <p>{errors.hashtag.message}</p>}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-2">
            {HASHTAGS.map((item) => (
              <button
                key={item.hashtag}
                type="button"
                onClick={() => setValue('hashtag', item.hashtag)}
                className="inline-flex h-6 w-min items-center justify-center rounded-md bg-neutral-100 px-2 text-sm hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                {item.hashtag}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-col items-center justify-center gap-2">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-lg bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
            >
              <span className="w-5" />
              <span>Add</span>
              <ArrowRightCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </WidgetWrapper>
  );
}
