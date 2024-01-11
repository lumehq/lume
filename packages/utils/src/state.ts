import { atom } from "jotai";

export const editorAtom = atom(false);
export const editorValueAtom = atom([
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
]);

export const onboardingAtom = atom(false);

export const activityAtom = atom(false);
export const activityUnreadAtom = atom(0);
