import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/select')({
  component: () => <div>Hello /select!</div>
})