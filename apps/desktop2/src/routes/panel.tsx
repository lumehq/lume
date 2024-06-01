import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/panel')({
  component: () => <div>Hello /panel!</div>
})