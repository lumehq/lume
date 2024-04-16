import { NotePin } from "./buttons/pin";
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
	Pin: NotePin,
	Content: NoteContent,
	Zap: NoteZap,
	Child: NoteChild,
	Thread: NoteThread,
};
