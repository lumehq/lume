import { Resolver, useForm } from 'react-hook-form';

import { ArrowRightCircleIcon } from '@shared/icons';

import { WidgetKinds } from '@stores/constants';

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
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const cancel = () => {
    removeWidget.mutate(params.id);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      addWidget.mutate({
        kind: WidgetKinds.global.hashtag,
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
    <div className="flex h-full shrink-0 grow-0 basis-[400px] flex-col items-center justify-center">
      <div className="w-full px-5">
        <h3 className="mb-4 text-center text-lg font-semibold">
          Enter hashtag you want to follow
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <input
              {...register('hashtag', { required: true, minLength: 1 })}
              placeholder="#bitcoin"
              className="relative h-12 w-full rounded-lg bg-neutral-200 px-3 py-1 text-neutral-900 !outline-none placeholder:text-neutral-500 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-300"
            />
            <span className="text-sm text-red-400">
              {errors.hashtag && <p>{errors.hashtag.message}</p>}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
            >
              <span className="w-5" />
              <span>Create</span>
              <ArrowRightCircleIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={cancel}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-6 font-medium leading-none text-neutral-900 hover:bg-neutral-200 focus:outline-none disabled:opacity-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
