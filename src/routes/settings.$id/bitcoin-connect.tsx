import { init } from '@getalby/bitcoin-connect-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/$id/bitcoin-connect')({
  beforeLoad: () => {
    init({
      appName: 'Lume',
      filters: ['nwc'],
      showBalance: true,
    })
  },
})
