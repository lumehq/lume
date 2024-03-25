import { Box, Container } from "@lume/ui";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth")({
  component: Screen,
});

function Screen() {
  return (
    <Container withDrag>
      <Box className="px-3 pt-3">
        <Outlet />
      </Box>
    </Container>
  );
}
