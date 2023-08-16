import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useStorage } from '@libs/storage/provider';

import { CancelIcon, CommandIcon, LoaderIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { BLOCK_KINDS, DEFAULT_AVATAR } from '@stores/constants';
import { useWidgets } from '@stores/widgets';

import { useImageUploader } from '@utils/hooks/useUploader';

export function ImageModal() {
  const upload = useImageUploader();
  const setWidget = useWidgets((state) => state.setWidget);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');

  const { db } = useStorage();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, isValid },
  } = useForm();

  const uploadImage = async () => {
    const image = await upload(null, true);
    if (image.url) {
      setImage(image.url);
    }
  };

  const onSubmit = async (data: { kind: number; title: string; content: string }) => {
    setLoading(true);

    // mutate
    setWidget(db, { kind: BLOCK_KINDS.image, title: data.title, content: data.content });

    setLoading(false);
    // reset form
    reset();
    // close modal
    setOpen(false);
  };

  useEffect(() => {
    setValue('content', image);
  }, [setValue, image]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-72 items-center justify-start gap-2.5 rounded-md px-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10">
              <CommandIcon width={12} height={12} className="text-white" />
            </div>
            <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10">
              <span className="text-sm leading-none text-white">I</span>
            </div>
          </div>
          <h5 className="font-medium text-white/50">Add image widget</h5>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10">
            <div className="h-min w-full shrink-0 border-b border-white/10 bg-white/5 px-5 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold leading-none text-white">
                    Create image block
                  </Dialog.Title>
                  <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10">
                    <CancelIcon className="h-4 w-4 text-white/50" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="text-sm leading-tight text-white/50">
                  Pin your favorite image to Space then you can view every time that you
                  use Lume, your image will be broadcast to Nostr Relay as well
                </Dialog.Description>
              </div>
            </div>
            <div className="flex h-full w-full flex-col overflow-y-auto px-5 pb-5 pt-3">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mb-0 flex h-full w-full flex-col gap-3"
              >
                <input type={'hidden'} {...register('content')} value={image} />
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium uppercase tracking-wider text-white/50"
                  >
                    Title *
                  </label>
                  <input
                    type={'text'}
                    {...register('title', {
                      required: true,
                    })}
                    spellCheck={false}
                    className="relative h-11 w-full rounded-lg bg-white/10 px-3 py-2 text-white !outline-none placeholder:text-white/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="picture"
                    className="text-sm font-medium uppercase tracking-wider text-white/50"
                  >
                    Picture
                  </label>
                  <div className="relative inline-flex h-56 w-full items-center justify-center overflow-hidden rounded-lg bg-white/10">
                    <Image
                      src={image}
                      fallback={DEFAULT_AVATAR}
                      alt="content"
                      className="relative z-10 h-auto max-h-[156px] w-[150px] rounded-md object-cover"
                    />
                    <div className="absolute bottom-3 right-3 z-10">
                      <button
                        onClick={() => uploadImage()}
                        type="button"
                        className="inline-flex h-6 items-center justify-center rounded bg-white/10 px-3 text-sm font-medium text-white hover:bg-fuchsia-500"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!isDirty || !isValid}
                  className="inline-flex h-11 w-full transform items-center justify-center rounded-lg bg-fuchsia-500 font-medium text-white active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {loading ? (
                    <LoaderIcon className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    'Confirm'
                  )}
                </button>
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
