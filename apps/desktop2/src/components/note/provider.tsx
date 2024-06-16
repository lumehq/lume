import type { LumeEvent } from "@lume/system";
import { type ReactNode, createContext, useContext } from "react";

const NoteContext = createContext<LumeEvent>(null);

export function NoteProvider({
	event,
	children,
}: {
	event: LumeEvent;
	children: ReactNode;
}) {
	return <NoteContext.Provider value={event}>{children}</NoteContext.Provider>;
}

export function useNoteContext() {
	const context = useContext(NoteContext);
	if (!context) {
		throw new Error("Please import Note Provider to use useNoteContext() hook");
	}
	return context;
}
