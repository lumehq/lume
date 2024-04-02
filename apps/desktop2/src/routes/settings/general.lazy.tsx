import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/settings/general')({
  component: () => <div>Hello /settings/general!</div>
})