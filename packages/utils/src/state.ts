import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Editor
export const editorAtom = atom(false);
export const editorValueAtom = atom([
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
]);

// Onboarding
export const onboardingAtom = atomWithStorage("onboarding", {
	open: true,
	newUser: false,
});

// Activity
export const activityAtom = atom(false);
export const activityUnreadAtom = atom(0);

// Tutorial
export const tutorialAtom = atomWithStorage("tutorial", true);
