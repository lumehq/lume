import { SearchIcon } from "@lume/icons";
import { type Event, Kind } from "@lume/types";
import { Note, Spinner, User } from "@lume/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export const Route = createFileRoute("/search")({
	component: Screen,
});

function Screen() {
	const { ark } = Route.useRouteContext();

	const [loading, setLoading] = useState(false);
	const [events, setEvents] = useState<Event[]>([]);
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 500);

	const searchEvents = async () => {
		if (!value.length) return;

		// start loading
		setLoading(true);

		const data = await ark.search(value, 100);

		// update state
		setLoading(false);
		setEvents(data);
	};

	useEffect(() => {
		searchEvents();
	}, [value]);

	return (
		<div
			data-tauri-drag-region
			className="flex flex-col w-full h-full bg-gradient-to-tr from-neutral-200 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900"
		>
			<div
				data-tauri-drag-region
				className="relative h-24 shrink-0 flex items-end border-neutral-300 border-b dark:border-neutral-700"
			>
				<div
					data-tauri-drag-region
					className="absolute top-0 left-0 w-full h-4"
				/>
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") searchEvents();
					}}
					placeholder="Search anything..."
					className="z-10 w-full h-20 pt-10 px-6 text-lg bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-600"
				/>
			</div>
			<div className="flex-1 p-3 overflow-y-auto scrollbar-none">
				{loading ? (
					<div className="w-full h-full flex items-center justify-center">
						<Spinner />
					</div>
				) : !events.length ? (
					<div className="flex items-center justify-center h-full text-sm">
						Empty
					</div>
				) : (
					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-1.5">
							<div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 shrink-0">
								Users
							</div>
							<div className="flex-1 flex flex-col gap-3">
								{events
									.filter((ev) => ev.kind === Kind.Metadata)
									.map((event) => (
										<SearchUser key={event.id} event={event} />
									))}
							</div>
						</div>
						<div className="flex flex-col gap-1.5">
							<div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 shrink-0">
								Notes
							</div>
							<div className="flex-1 flex flex-col gap-3">
								{events
									.filter((ev) => ev.kind === Kind.Text)
									.map((event) => (
										<SearchNote key={event.id} event={event} />
									))}
							</div>
						</div>
					</div>
				)}
				{!loading && !events.length ? (
					<div className="h-full flex items-center justify-center flex-col gap-3">
						<div className="size-16 bg-blue-100 dark:bg-blue-900 rounded-full inline-flex items-center justify-center text-blue-500">
							<SearchIcon className="size-6" />
						</div>
						Try searching for people, notes, or keywords
					</div>
				) : null}
			</div>
		</div>
	);
}

function SearchUser({ event }: { event: Event }) {
	const { ark } = Route.useRouteContext();

	return (
		<button
			key={event.id}
			type="button"
			onClick={() => ark.open_profile(event.pubkey)}
			className="p-3 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg"
		>
			<User.Provider pubkey={event.pubkey} embedProfile={event.content}>
				<User.Root className="flex items-center gap-2">
					<User.Avatar className="size-11 rounded-full shrink-0" />
					<div>
						<User.Name className="font-semibold" />
						<User.NIP05 />
					</div>
				</User.Root>
			</User.Provider>
		</button>
	);
}

function SearchNote({ event }: { event: Event }) {
	const { ark } = Route.useRouteContext();

	return (
		<div
			key={event.id}
			onClick={() => ark.open_event(event)}
			onKeyDown={() => ark.open_event(event)}
			className="p-3 bg-white rounded-lg dark:bg-black"
		>
			<Note.Provider event={event}>
				<Note.Root>
					<Note.User />
					<div className="select-text mt-2.5 leading-normal line-clamp-5 text-balance">
						{event.content}
					</div>
				</Note.Root>
			</Note.Provider>
		</div>
	);
}
