import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/users/$pubkey")({
  component: User,
});

function User() {
  const { pubkey } = Route.useParams();

  return <div>{pubkey}</div>;
}
