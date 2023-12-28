import { NDKEvent } from "@nostr-dev-kit/ndk";
import { ReactNode, createContext, useContext } from "react";

const EventContext = createContext<NDKEvent>(null);

export function NoteProvider({
	event,
	children,
}: { event: NDKEvent; children: ReactNode }) {
	return (
		<EventContext.Provider value={event}>{children}</EventContext.Provider>
	);
}

export function useNoteContext() {
	const context = useContext(EventContext);
	if (!context) {
		throw new Error("Please import Note Provider to use useNoteContext() hook");
	}
	return context;
}
