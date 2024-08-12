import { Container } from "@/components";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth")({
	component: Screen,
});

function Screen() {
	return (
		<Container withDrag>
			<div className="max-w-sm mx-auto size-full">
				<Outlet />
			</div>
		</Container>
	);
}
