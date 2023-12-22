import { NoteChild } from './child';
import { NoteKind } from './kind';
import { NoteMenu } from './menu';
import { NotePin } from './pin';
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
  Kind: NoteKind,
  Reply: NoteReply,
  Repost: NoteRepost,
  Reaction: NoteReaction,
  Zap: NoteZap,
  Pin: NotePin,
  Child: NoteChild,
};
