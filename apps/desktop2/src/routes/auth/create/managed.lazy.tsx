import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/create/managed')({
  component: () => <div>Hello /auth/create/managed!</div>
})