import { NoteUpvote } from "./upvote";
import { NoteDownvote } from "./downvote";

export function NoteReaction() {
  return (
    <div className="inline-flex items-center gap-2">
      <NoteUpvote />
      <NoteDownvote />
    </div>
  );
}
