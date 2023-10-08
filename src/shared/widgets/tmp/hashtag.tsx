import { Resolver, useForm } from 'react-hook-form';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon } from '@shared/icons';

import { WidgetKinds, useWidgets } from '@stores/widgets';

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
  const [setWidget, removeWidget] = useWidgets((state) => [
    state.setWidget,
    state.removeWidget,
  ]);

  const { db } = useStorage();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const cancel = () => {
    removeWidget(db, params.id);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setWidget(db, {
        kind: WidgetKinds.global.hashtag,
        title: data.hashtag,
        content: data.hashtag.replace('#', ''),
      });
      // remove temp widget
      removeWidget(db, params.id);
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
              className="relative h-11 w-full rounded-lg bg-zinc-100 px-3 py-1 text-zinc-900 !outline-none backdrop-blur-xl placeholder:text-white/50 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <span className="text-sm text-red-400">
              {errors.hashtag && <p>{errors.hashtag.message}</p>}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-interor-500 px-6 font-medium text-zinc-900 hover:bg-interor-600 focus:outline-none disabled:opacity-50 dark:text-zinc-100"
            >
              <span className="w-5" />
              <span>Create</span>
              <ArrowRightCircleIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={cancel}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 px-6 font-medium leading-none text-zinc-900 backdrop-blur-xl hover:bg-white/20 focus:outline-none disabled:opacity-50 dark:bg-zinc-900 dark:text-zinc-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
