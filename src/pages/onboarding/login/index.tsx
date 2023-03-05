import BaseLayout from '@layouts/base';
import OnboardingLayout from '@layouts/onboarding';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { nip19 } from 'nostr-tools';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';
import { Resolver, useForm } from 'react-hook-form';

type FormValues = {
  key: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.key ? values : {},
    errors: !values.key
      ? {
          key: {
            type: 'required',
            message: 'This is required.',
          },
        }
      : {},
  };
};

export default function Page() {
  const router = useRouter();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: any) => {
    let privkey = data['key'];

    if (privkey.substring(0, 4) === 'nsec') {
      privkey = nip19.decode(privkey).data;
    }

    try {
      router.push({
        pathname: '/onboarding/login/fetch',
        query: { privkey: privkey },
      });
    } catch (error) {
      setError('key', {
        type: 'custom',
        message: 'Private Key is invalid, please check again',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col justify-between px-8">
      <div>{/* spacer */}</div>
      <motion.div layoutId="form">
        <div className="mb-8 flex flex-col gap-3">
          <motion.h1
            layoutId="title"
            className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent"
          >
            Import your private key
          </motion.h1>
          <motion.h2 layoutId="subtitle" className="w-3/4 text-zinc-400">
            You can import private key format as hex string or nsec. If you have installed Nostr Connect compality
            wallet in your mobile, you can connect by scan QR Code below
          </motion.h2>
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
            <input
              {...register('key', { required: true, minLength: 32 })}
              type={'password'}
              placeholder="Paste nsec or hex key here..."
              className="relative w-full rounded-lg border border-black/5 px-3.5 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
            />
          </div>
          <span className="text-sm text-red-400">{errors.key && <p>{errors.key.message}</p>}</span>
        </div>
      </motion.div>
      <motion.div layoutId="action" className="pb-5">
        <div className="flex h-10 items-center">
          {isSubmitting ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="transform rounded-lg bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 px-3.5 py-2 font-medium active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span className="drop-shadow-lg">Continue →</span>
            </button>
          )}
        </div>
      </motion.div>
    </form>
  );
}

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return (
    <BaseLayout>
      <OnboardingLayout>{page}</OnboardingLayout>
    </BaseLayout>
  );
};
