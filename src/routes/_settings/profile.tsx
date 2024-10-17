import { type Profile, commands } from '@/commands.gen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_settings/profile')({
  beforeLoad: async ({ params }) => {
    const res = await commands.getProfile(params.account)

    if (res.status === 'ok') {
      const profile: Profile = JSON.parse(res.data)
      return { profile }
    } else {
      throw new Error(res.error)
    }
  },
})
