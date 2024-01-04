import { atom } from "jotai";

export const editorAtom = atom(false);
export const editorValueAtom = atom([
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
]);
