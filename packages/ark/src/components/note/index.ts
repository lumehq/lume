import { NotePin } from "./buttons/pin";
import { NoteReaction } from "./buttons/reaction";
import { NoteReply } from "./buttons/reply";
import { NoteRepost } from "./buttons/repost";
import { NoteZap } from "./buttons/zap";
import { NoteChild } from "./child";
import { NoteContent } from "./content";
import { NoteMenu } from "./menu";
import { NoteProvider } from "./provider";
import { NoteRoot } from "./root";
import { NoteThread } from "./thread";
import { NoteUser } from "./user";

export const Note = {
	Provider: NoteProvider,
	Root: NoteRoot,
	User: NoteUser,
	Menu: NoteMenu,
	Reply: NoteReply,
	Repost: NoteRepost,
	Reaction: NoteReaction,
	Content: NoteContent,
	Zap: NoteZap,
	Pin: NotePin,
	Child: NoteChild,
	Thread: NoteThread,
};

export * from "./provider";
export * from "./primitives/text";
export * from "./primitives/repost";
export * from "./primitives/skeleton";
export * from "./primitives/thread";
export * from "./primitives/reply";
export * from "./preview/image";
export * from "./preview/link";
export * from "./preview/video";
export * from "./mentions/note";
export * from "./mentions/user";
export * from "./mentions/hashtag";
export * from "./mentions/invoice";
