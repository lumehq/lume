import { Box, Container } from "@lume/ui";
import { cn } from "@lume/utils";
import { Link, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/activity/$account")({
  component: Screen,
});

function Screen() {
  const { account } = Route.useParams();

  return (
    <Container withDrag>
      <Box className="scrollbar-none shadow-none bg-black/5 dark:bg-white/5 backdrop-blur-sm flex flex-col overflow-y-auto">
        <div className="h-14 shrink-0 flex w-full items-center gap-1 px-3">
          <div className="inline-flex h-full w-full items-center gap-1">
            <Link to="/activity/$account/texts" params={{ account }}>
              {({ isActive }) => (
                <div
                  className={cn(
                    "inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
                    isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
                  )}
                >
                  Notes
                </div>
              )}
            </Link>
            <Link to="/activity/$account/zaps" params={{ account }}>
              {({ isActive }) => (
                <div
                  className={cn(
                    "inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
                    isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
                  )}
                >
                  Zaps
                </div>
              )}
            </Link>
          </div>
        </div>
        <div className="px-2 flex-1 overflow-y-auto w-full h-full scrollbar-none">
          <Outlet />
        </div>
      </Box>
    </Container>
  );
}
