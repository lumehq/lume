import { LumeEvent } from "@lume/system";
import type { NostrEvent } from "@lume/types";
import { type ReactNode, createContext, useContext } from "react";

const NoteContext = createContext<LumeEvent>(null);

export function NoteProvider({
	event,
	children,
}: {
	event: NostrEvent;
	children: ReactNode;
}) {
	const lumeEvent = new LumeEvent(event);

	return (
		<NoteContext.Provider value={lumeEvent}>{children}</NoteContext.Provider>
	);
}

export function useNoteContext() {
	const context = useContext(NoteContext);
	if (!context) {
		throw new Error("Please import Note Provider to use useNoteContext() hook");
	}
	return context;
}
