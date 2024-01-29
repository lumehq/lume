import { Note, User, useArk, useColumnContext } from "@lume/ark";
import { LoaderIcon, SearchIcon } from "@lume/icons";
import { COL_TYPES, searchAtom } from "@lume/utils";
import { type NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import { Command } from "../cmdk";

export function SearchDialog() {
	const ark = useArk();

	const [open, setOpen] = useAtom(searchAtom);
	const [loading, setLoading] = useState(false);
	const [events, setEvents] = useState<NDKEvent[]>([]);
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 1200);

	const { t } = useTranslation();
	const { vlistRef, columns, addColumn } = useColumnContext();

	const searchEvents = async () => {
		if (!value.length) return;

		// start loading
		setLoading(true);

		// search events, require nostr.band relay
		const events = await ark.getEvents({
			kinds: [NDKKind.Text, NDKKind.Metadata],
			search: value,
			limit: 20,
		});

		// update state
		setLoading(false);
		setEvents(events);
	};

	const selectEvent = (kind: NDKKind, value: string) => {
		if (!value.length) return;

		if (kind === NDKKind.Metadata) {
			// add new column
			addColumn({
				kind: COL_TYPES.user,
				title: "User",
				content: value,
			});
		} else {
			// add new column
			addColumn({
				kind: COL_TYPES.thread,
				title: "",
				content: value,
			});
		}

		// update state
		setOpen(false);
		vlistRef?.current.scrollToIndex(columns.length);
	};

	useEffect(() => {
		searchEvents();
	}, [value]);

	// Toggle the menu when ⌘K is pressed
	useEffect(() => {
		const down = (e) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<Command.Dialog
			open={open}
			onOpenChange={setOpen}
			shouldFilter={false}
			label="Search"
			overlayClassName="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm dark:bg-white/10"
			contentClassName="fixed inset-0 z-50 flex items-center justify-center min-h-full"
			className="relative w-full max-w-xl bg-white h-min rounded-xl dark:bg-black"
		>
			<div className="px-3 pt-3">
				<Command.Input
					value={search}
					onValueChange={setSearch}
					placeholder={t("search.placeholder")}
					className="w-full h-12 bg-neutral-100 dark:bg-neutral-900 rounded-xl border-none focus:outline-none focus:ring-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-600"
				/>
			</div>
			<Command.List className="mt-4 h-[500px] px-3 overflow-y-auto w-full flex flex-col">
				{loading ? (
					<Command.Loading className="flex items-center justify-center h-full">
						<LoaderIcon className="size-5 animate-spin" />
					</Command.Loading>
				) : !events.length ? (
					<Command.Empty className="flex items-center justify-center h-full text-sm">
						{t("global.noResult")}
					</Command.Empty>
				) : (
					<>
						<Command.Group heading="Users">
							{events
								.filter((ev) => ev.kind === NDKKind.Metadata)
								.map((event) => (
									<Command.Item
										key={event.id}
										value={event.pubkey}
										onSelect={(value) => selectEvent(event.kind, value)}
										className="py-3 px-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl my-3 focus:ring-1 focus:ring-blue-500"
									>
										<User.Provider pubkey={event.pubkey} embed={event.content}>
											<User.Root className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<User.Avatar className="size-11 rounded-lg shrink-0 ring-1 ring-neutral-100 dark:ring-neutral-900" />
													<div>
														<User.Name className="font-semibold" />
														<User.NIP05 pubkey={event.pubkey} />
													</div>
												</div>
												<User.Button
													target={event.pubkey}
													className="inline-flex items-center justify-center w-20 font-medium text-sm border-t rounded-lg border-neutral-900 dark:border-neutral-800 h-9 bg-neutral-950 text-neutral-50 dark:bg-neutral-900 hover:bg-neutral-900 dark:hover:bg-neutral-800"
												/>
											</User.Root>
										</User.Provider>
									</Command.Item>
								))}
						</Command.Group>
						<Command.Group heading="Notes">
							{events
								.filter((ev) => ev.kind === NDKKind.Text)
								.map((event) => (
									<Command.Item
										key={event.id}
										value={event.id}
										onSelect={(value) => selectEvent(event.kind, value)}
										className="py-3 px-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl my-3"
									>
										<Note.Provider event={event}>
											<Note.Root>
												<Note.User />
												<div className="select-text mt-2 leading-normal line-clamp-3 text-balance">
													{event.content}
												</div>
											</Note.Root>
										</Note.Provider>
									</Command.Item>
								))}
						</Command.Group>
					</>
				)}
				{!loading ? (
					<div className="h-full flex items-center justify-center flex-col gap-3">
						<div className="size-16 bg-blue-100 dark:bg-blue-900 rounded-full inline-flex items-center justify-center text-blue-500">
							<SearchIcon className="size-6" />
						</div>
						{t("search.empty")}
					</div>
				) : null}
			</Command.List>
		</Command.Dialog>
	);
}
