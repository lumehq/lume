import { init } from '@getalby/bitcoin-connect-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_settings/bitcoin-connect')({
  beforeLoad: () => {
    init({
      appName: 'Lume',
      filters: ['nwc'],
      showBalance: true,
    })
  },
})
