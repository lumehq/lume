import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/group/create')({
  component: () => <div>Hello /group/create!</div>
})