import { NoteActivity } from "./activity";
import { NoteOpenThread } from "./buttons/open";
import { NoteReply } from "./buttons/reply";
import { NoteRepost } from "./buttons/repost";
import { NoteZap } from "./buttons/zap";
import { NoteChild } from "./child";
import { NoteContent } from "./content";
import { NoteContentLarge } from "./contentLarge";
import { NoteMenu } from "./menu";
import { NoteProvider } from "./provider";
import { NoteRoot } from "./root";
import { NoteUser } from "./user";

export const Note = {
  Provider: NoteProvider,
  Root: NoteRoot,
  User: NoteUser,
  Menu: NoteMenu,
  Reply: NoteReply,
  Repost: NoteRepost,
  Content: NoteContent,
  ContentLarge: NoteContentLarge,
  Zap: NoteZap,
  Open: NoteOpenThread,
  Child: NoteChild,
  Activity: NoteActivity,
};
