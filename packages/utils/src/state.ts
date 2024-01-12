import { atom } from "jotai";

// Editor
export const editorAtom = atom(false);
export const editorValueAtom = atom([
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
]);

// Onboarding
export const onboardingAtom = atom(false);

// Activity
export const activityAtom = atom(false);
export const activityUnreadAtom = atom(0);
