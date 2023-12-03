import * as Dialog from '@radix-ui/react-dialog';
import { Resolver, useForm } from 'react-hook-form';

import { CancelIcon, GroupFeedsIcon, PlusIcon } from '@shared/icons';

import { HASHTAGS, WIDGET_KIND } from '@utils/constants';
import { useWidget } from '@utils/hooks/useWidget';

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

export function AddHashtagFeeds({ currentWidgetId }: { currentWidgetId: string }) {
  const { replaceWidget } = useWidget();
  const {
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: FormValues) => {
    try {
      replaceWidget.mutate({
        currentId: currentWidgetId,
        widget: {
          kind: WIDGET_KIND.hashtag,
          title: data.hashtag,
          content: data.hashtag.replace('#', ''),
        },
      });
    } catch (e) {
      setError('hashtag', {
        type: 'custom',
        message: e,
      });
    }
  };

  return (
    <Dialog.Root>
      <div className="inline-flex h-14 w-full items-center justify-between rounded-lg bg-neutral-50 px-3 hover:shadow-md hover:shadow-neutral-200/50 dark:bg-neutral-950 dark:hover:shadow-neutral-800/50">
        <div className="inline-flex items-center gap-2.5">
          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900">
            <GroupFeedsIcon className="h-4 w-4" />
          </div>
          <p className="font-medium">Hashtag</p>
        </div>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="inline-flex h-6 items-center gap-1 rounded-md bg-neutral-100 pl-1.5 pr-2.5 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-900"
          >
            <PlusIcon className="h-3 w-3" />
            Add
          </button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-black/20" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-neutral-50 dark:bg-neutral-950">
            <div className="w-full shrink-0 rounded-t-xl border-b border-neutral-100 px-3 py-5 dark:border-neutral-900">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold leading-none text-neutral-900 dark:text-neutral-100">
                  Adding hashtag feeds
                </Dialog.Title>
                <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-900 hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-800">
                  <CancelIcon className="h-4 w-4" />
                </Dialog.Close>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 px-3 py-3">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mb-0 flex flex-col gap-2"
              >
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
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Suggestions:
                  </span>
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
                </div>
                <div className="mt-2 flex flex-col items-center justify-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
