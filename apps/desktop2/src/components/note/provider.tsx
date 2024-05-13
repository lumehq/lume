import type { Event } from "@lume/types";
import { type ReactNode, createContext, useContext } from "react";

const EventContext = createContext<Event>(null);

export function NoteProvider({
	event,
	children,
}: { event: Event; children: ReactNode }) {
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
