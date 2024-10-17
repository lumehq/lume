import { type Profile, commands } from '@/commands.gen'
import { cn, upload } from '@/commons'
import { Spinner } from '@/components'
import { Plus } from '@phosphor-icons/react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { message } from '@tauri-apps/plugin-dialog'
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
  useTransition,
} from 'react'
import { useForm } from 'react-hook-form'

export const Route = createLazyFileRoute('/_settings/profile')({
  component: Screen,
})

function Screen() {
  const { profile } = Route.useRouteContext()
  const { register, handleSubmit } = useForm({ defaultValues: profile })

  const [isPending, startTransition] = useTransition()
  const [picture, setPicture] = useState<string>('')

  const onSubmit = (data: Profile) => {
    startTransition(async () => {
      const newProfile: Profile = { ...profile, ...data, picture }
      const res = await commands.setProfile(newProfile)

      if (res.status === 'error') {
        await message(res.error, { title: 'Profile', kind: 'error' })
      }

      return
    })
  }

  return (
    <div className="relative flex flex-col gap-6 px-3 pb-3">
      <div className="flex items-center flex-1 h-full gap-3">
        <div className="relative rounded-full size-20 bg-gradient-to-tr from-orange-100 via-red-50 to-blue-200">
          {profile.picture ? (
            <img
              src={picture || profile.picture}
              alt="avatar"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 z-10 object-cover size-20 rounded-full"
            />
          ) : null}
          <AvatarUploader
            setPicture={setPicture}
            className="absolute inset-0 z-20 flex items-center justify-center size-full text-white rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <Plus className="size-5" />
          </AvatarUploader>
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">{profile.display_name}</div>
            <div className="text-neutral-700 dark:text-neutral-300">
              {profile.nip05}
            </div>
          </div>
          <PrivkeyButton />
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 mb-0"
      >
        <div className="flex flex-col w-full gap-1">
          <label
            htmlFor="display_name"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Display Name
          </label>
          <input
            name="display_name"
            {...register('display_name')}
            spellCheck={false}
            className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <label
            htmlFor="name"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Name
          </label>
          <input
            name="name"
            {...register('name')}
            spellCheck={false}
            className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <label
            htmlFor="website"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Website
          </label>
          <input
            name="website"
            type="url"
            {...register('website')}
            spellCheck={false}
            className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <label
            htmlFor="banner"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Cover
          </label>
          <input
            name="banner"
            type="url"
            {...register('banner')}
            spellCheck={false}
            className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <label
            htmlFor="nip05"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            NIP-05
          </label>
          <input
            name="nip05"
            type="email"
            {...register('nip05')}
            spellCheck={false}
            className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <label
            htmlFor="lnaddress"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Lightning Address
          </label>
          <input
            name="lnaddress"
            type="email"
            {...register('lud16')}
            className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center w-32 px-2 text-sm font-medium text-white bg-blue-500 rounded-lg h-9 hover:bg-blue-600 disabled:opacity-50"
          >
            {isPending ? <Spinner className="size-4" /> : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}

function PrivkeyButton() {
  const { account } = Route.useParams()

  const [isPending, startTransition] = useTransition()
  const [isCopy, setIsCopy] = useState(false)

  const copyPrivateKey = () => {
    startTransition(async () => {
      const res = await commands.getPrivateKey(account)

      if (res.status === 'ok') {
        await writeText(res.data)
        setIsCopy(true)
      } else {
        await message(res.error, { kind: 'error' })
        return
      }
    })
  }

  return (
    <button
      type="button"
      onClick={() => copyPrivateKey()}
      className="inline-flex items-center justify-center px-3 text-sm font-medium text-blue-500 bg-blue-100 border border-blue-300 rounded-full h-7 hover:bg-blue-200 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-800"
    >
      {isPending ? (
        <Spinner className="size-4" />
      ) : isCopy ? (
        'Copied'
      ) : (
        'Copy Private Key'
      )}
    </button>
  )
}

function AvatarUploader({
  setPicture,
  children,
  className,
}: {
  setPicture: Dispatch<SetStateAction<string>>
  children: ReactNode
  className?: string
}) {
  const [isPending, startTransition] = useTransition()

  const uploadAvatar = () => {
    startTransition(async () => {
      try {
        const image = await upload()
        setPicture(image)
      } catch (e) {
        await message(String(e))
        return
      }
    })
  }

  return (
    <button
      type="button"
      onClick={() => uploadAvatar()}
      className={cn('size-4', className)}
    >
      {isPending ? <Spinner className="size-4" /> : children}
    </button>
  )
}
