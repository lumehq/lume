import { commands } from '@/commands.gen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_settings/relay')({
  beforeLoad: async () => {
    const res = await commands.getRelays()

    if (res.status === 'ok') {
      const relayList = res.data
      return { relayList }
    } else {
      throw new Error(res.error)
    }
  },
})
