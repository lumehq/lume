import { NoteChild } from './child';
import { NoteContent } from './content';
import { NoteMenu } from './menu';
import { NoteReaction } from './reaction';
import { NoteReply } from './reply';
import { NoteRepost } from './repost';
import { NoteRoot } from './root';
import { NoteUser } from './user';
import { NoteZap } from './zap';

export const Note = {
  Root: NoteRoot,
  User: NoteUser,
  Menu: NoteMenu,
  Content: NoteContent,
  Reply: NoteReply,
  Repost: NoteRepost,
  Reaction: NoteReaction,
  Zap: NoteZap,
  Child: NoteChild,
};
