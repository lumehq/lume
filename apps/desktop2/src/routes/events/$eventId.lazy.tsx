import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/events/$eventId")({
  component: Event,
});

function Event() {
  const { eventId } = Route.useParams();

  return <div>{eventId}</div>;
}
