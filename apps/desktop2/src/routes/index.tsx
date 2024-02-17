import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location, context }) => {
    const ark = context.ark;
    const signer = await ark.verify_signer();
    if (!signer) {
      throw redirect({
        to: "/landing",
        search: {
          redirect: location.href,
        },
      });
    }
    throw redirect({
      to: "/app/space",
    });
  },
});
