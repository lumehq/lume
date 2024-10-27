import type { RichEvent } from "@/commands.gen";
import { Spinner } from "@/components";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import type { OsType } from "@tauri-apps/plugin-os";
import { nip19 } from "nostr-tools";
import { useEffect } from "react";

interface RouterContext {
	queryClient: QueryClient;
	platform: OsType;
	accounts?: string[];
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: Screen,
	pendingComponent: Pending,
});

function Screen() {
	const { queryClient } = Route.useRouteContext();

	useEffect(() => {
		const unlisten = listen<RichEvent>("event", async (data) => {
			const event = JSON.parse(data.payload.raw);

			if (event.kind === 0) {
				const npub = nip19.npubEncode(event.pubkey);
				await queryClient.invalidateQueries({
					queryKey: ["profile", npub, event.pubkey],
				});
			}
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	return <Outlet />;
}

function Pending() {
	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<Spinner className="size-5" />
		</div>
	);
}
