import { commands } from '@/commands.gen'
import { decodeZapInvoice, formatCreatedAt } from '@/commons'
import { Note, RepostIcon, Spinner, User } from '@/components'
import { LumeEvent, LumeWindow, useEvent } from '@/system'
import { Kind, type NostrEvent } from '@/types'
import { Info } from '@phosphor-icons/react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Tabs from '@radix-ui/react-tabs'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { type ReactNode, useEffect, useMemo, useRef } from 'react'
import { Virtualizer } from 'virtua'

export const Route = createLazyFileRoute('/columns/_layout/notification/$id')({
  component: Screen,
})

function Screen() {
  const { queryClient } = Route.useRouteContext()
  const { isLoading, data } = useQuery({
    queryKey: ['notification'],
    queryFn: async () => {
      const res = await commands.getNotifications()

      if (res.status === 'error') {
        throw new Error(res.error)
      }

      const data: NostrEvent[] = res.data.map((item) => JSON.parse(item))
      const events = data.map((ev) => new LumeEvent(ev))

      return events
    },
    select: (events) => {
      const zaps = new Map<string, LumeEvent[]>()
      const reactions = new Map<string, LumeEvent[]>()

      const texts = events.filter((ev) => ev.kind === Kind.Text)
      const zapEvents = events.filter((ev) => ev.kind === Kind.ZapReceipt)
      const reactEvents = events.filter(
        (ev) => ev.kind === Kind.Repost || ev.kind === Kind.Reaction,
      )

      for (const event of reactEvents) {
        const rootId = event.tags.filter((tag) => tag[0] === 'e')[0]?.[1]

        if (rootId) {
          if (reactions.has(rootId)) {
            reactions.get(rootId).push(event)
          } else {
            reactions.set(rootId, [event])
          }
        }
      }

      for (const event of zapEvents) {
        const rootId = event.tags.filter((tag) => tag[0] === 'e')[0]?.[1]

        if (rootId) {
          if (zaps.has(rootId)) {
            zaps.get(rootId).push(event)
          } else {
            zaps.set(rootId, [event])
          }
        }
      }

      return { texts, zaps, reactions }
    },
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const unlisten = getCurrentWindow().listen('event', async (data) => {
      const event: LumeEvent = JSON.parse(data.payload as string)
      await queryClient.setQueryData(['notification'], (data: LumeEvent[]) => [
        event,
        ...data,
      ])
    })

    return () => {
      unlisten.then((f) => f())
    }
  }, [])

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="px-3 h-full overflow-y-auto">
      <Tabs.Root
        defaultValue="replies"
        className="flex flex-col h-full bg-white dark:bg-black rounded-t-xl shadow shadow-neutral-300/50 dark:shadow-none border-[.5px] border-neutral-300 dark:border-neutral-700"
      >
        <Tabs.List className="h-11 shrink-0 flex items-center">
          <Tabs.Trigger
            className="flex-1 inline-flex h-11 items-center justify-center gap-2 px-3 text-sm font-medium border-b border-neutral-100 dark:border-neutral-900 data-[state=active]:border-neutral-200 dark:data-[state=active]:border-neutral-800 data-[state=inactive]:opacity-50"
            value="replies"
          >
            Replies
          </Tabs.Trigger>
          <Tabs.Trigger
            className="flex-1 inline-flex h-11 items-center justify-center gap-2 px-3 text-sm font-medium border-b border-neutral-100 dark:border-neutral-900 data-[state=active]:border-neutral-200 dark:data-[state=active]:border-neutral-800 data-[state=inactive]:opacity-50"
            value="reactions"
          >
            Reactions
          </Tabs.Trigger>
          <Tabs.Trigger
            className="flex-1 inline-flex h-11 items-center justify-center gap-2 px-3 text-sm font-medium border-b border-neutral-100 dark:border-neutral-900 data-[state=active]:border-neutral-200 dark:data-[state=active]:border-neutral-800 data-[state=inactive]:opacity-50"
            value="zaps"
          >
            Zaps
          </Tabs.Trigger>
        </Tabs.List>
        <ScrollArea.Root
          type={'scroll'}
          scrollHideDelay={300}
          className="min-h-0 flex-1 overflow-x-hidden"
        >
          <Tab value="replies">
            {data.texts.map((event) => (
              <TextNote key={event.id} event={event} />
            ))}
          </Tab>
          <Tab value="reactions">
            {[...data.reactions.entries()].map(([root, events]) => (
              <div
                key={root}
                className="p-3 w-full border-b-[.5px] border-neutral-300 dark:border-neutral-700 hover:border-blue-500"
              >
                <div className="flex flex-col flex-1 min-w-0 gap-2">
                  <div className="flex items-center gap-2 pb-2">
                    <RootNote id={root} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {events.map((event) => (
                      <User.Provider key={event.id} pubkey={event.pubkey}>
                        <User.Root className="shrink-0 flex rounded-full h-7 bg-neutral-100 dark:bg-neutral-900 p-[2px]">
                          <User.Avatar className="flex-1 rounded-full size-6" />
                          <div className="inline-flex items-center justify-center flex-1 text-xs truncate rounded-full size-6">
                            {event.kind === Kind.Reaction ? (
                              event.content === '+' ? (
                                '👍'
                              ) : (
                                event.content
                              )
                            ) : (
                              <RepostIcon className="text-teal-400 size-4 dark:text-teal-600" />
                            )}
                          </div>
                        </User.Root>
                      </User.Provider>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </Tab>
          <Tab value="zaps">
            {[...data.zaps.entries()].map(([root, events]) => (
              <div
                key={root}
                className="p-3 w-full border-b-[.5px] border-neutral-300 dark:border-neutral-700 hover:border-blue-500"
              >
                <div className="flex flex-col flex-1 min-w-0 gap-2">
                  <div className="flex items-center gap-2 pb-2">
                    <RootNote id={root} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {events.map((event) => (
                      <ZapReceipt key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </Tab>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner className="bg-transparent" />
        </ScrollArea.Root>
      </Tabs.Root>
    </div>
  )
}

function Tab({ value, children }: { value: string; children: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <Tabs.Content value={value} className="size-full">
      <ScrollArea.Viewport ref={ref} className="h-full">
        <Virtualizer scrollRef={ref}>{children}</Virtualizer>
      </ScrollArea.Viewport>
    </Tabs.Content>
  )
}

function RootNote({ id }: { id: string }) {
  const { isLoading, isError, data } = useEvent(id)

  if (isLoading) {
    return (
      <div className="flex items-center pb-2 mb-2">
        <div className="rounded-full size-8 shrink-0 bg-black/20 dark:bg-white/20 animate-pulse" />
        <div className="w-2/3 h-4 rounded-md animate-pulse bg-black/20 dark:bg-white/20" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center justify-center text-white bg-red-500 rounded-full size-8 shrink-0">
          <Info className="size-5" />
        </div>
        <p className="text-sm text-red-500">
          Event not found with your current relay set
        </p>
      </div>
    )
  }

  return (
    <Note.Provider event={data}>
      <Note.Root className="flex items-center gap-2">
        <User.Provider pubkey={data.pubkey}>
          <User.Root className="shrink-0">
            <User.Avatar className="rounded-full size-8" />
          </User.Root>
        </User.Provider>
        <div className="line-clamp-1">{data.content}</div>
      </Note.Root>
    </Note.Provider>
  )
}

function TextNote({ event }: { event: LumeEvent }) {
  const pTags = event.tags
    .filter((tag) => tag[0] === 'p')
    .map((tag) => tag[1])
    .slice(0, 3)

  return (
    <button
      type="button"
      onClick={() => LumeWindow.openEvent(event)}
      className="p-3 w-full border-b-[.5px] border-neutral-300 dark:border-neutral-700 hover:border-blue-500"
    >
      <Note.Provider event={event}>
        <Note.Root className="flex flex-col">
          <User.Provider pubkey={event.pubkey}>
            <User.Root className="inline-flex items-center gap-2">
              <User.Avatar className="rounded-full size-9" />
              <div className="flex flex-col flex-1">
                <div className="flex items-baseline justify-between w-full">
                  <User.Name className="text-sm font-semibold leading-tight" />
                  <span className="text-sm leading-tight text-black/50 dark:text-white/50">
                    {formatCreatedAt(event.created_at)}
                  </span>
                </div>
                <div className="inline-flex items-baseline gap-1 text-xs">
                  <span className="leading-tight text-black/50 dark:text-white/50">
                    Reply to:
                  </span>
                  <div className="inline-flex items-baseline gap-1">
                    {[...new Set(pTags)].map((replyTo) => (
                      <User.Provider key={replyTo} pubkey={replyTo}>
                        <User.Root>
                          <User.Name className="font-medium leading-tight" />
                        </User.Root>
                      </User.Provider>
                    ))}
                  </div>
                </div>
              </div>
            </User.Root>
          </User.Provider>
          <div className="flex gap-2">
            <div className="w-9 shrink-0" />
            <div className="line-clamp-1 text-start">{event.content}</div>
          </div>
        </Note.Root>
      </Note.Provider>
    </button>
  )
}

function ZapReceipt({ event }: { event: LumeEvent }) {
  const amount = useMemo(
    () => decodeZapInvoice(event.tags).bitcoinFormatted ?? '0',
    [event.id],
  )
  const sender = useMemo(
    () => event.tags.find((tag) => tag[0] === 'P')?.[1],
    [event.id],
  )

  if (!sender) {
    return (
      <div className="shrink-0 flex gap-1.5 rounded-full h-7 bg-black/10 dark:bg-white/10 p-[2px]">
        <div className="rounded-full size-6 bg-blue-500" />
        <div className="flex-1 h-6 w-max pr-1.5 rounded-full inline-flex items-center justify-center text-xs font-semibold truncate">
          ₿ {amount}
        </div>
      </div>
    )
  }

  return (
    <User.Provider pubkey={sender}>
      <User.Root className="shrink-0 flex gap-1.5 rounded-full h-7 bg-black/10 dark:bg-white/10 p-[2px]">
        <User.Avatar className="rounded-full size-6" />
        <div className="flex-1 h-6 w-max pr-1.5 rounded-full inline-flex items-center justify-center text-xs font-semibold truncate">
          ₿ {amount}
        </div>
      </User.Root>
    </User.Provider>
  )
}
