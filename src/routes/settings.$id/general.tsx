import { commands } from '@/commands.gen'
import { appSettings } from '@/commons'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/$id/general')({
  beforeLoad: async () => {
    const res = await commands.getUserSettings()

    if (res.status === 'ok') {
      appSettings.setState((state) => {
        return { ...state, ...res.data }
      })
    } else {
      throw new Error(res.error)
    }
  },
})
