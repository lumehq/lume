import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: Screen,
});

function Screen() {
  return (
    <div>
      <h1>Login</h1>
      <Outlet />
    </div>
  );
}
