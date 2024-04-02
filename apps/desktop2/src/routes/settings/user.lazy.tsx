import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/settings/user')({
  component: () => <div>Hello /settings/user!</div>
})