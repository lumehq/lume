import { ReactionIcon } from "@lume/icons";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useState } from "react";
import { useNoteContext } from "../provider";

const REACTIONS = [
	{
		content: "👏",
		img: "/clapping_hands.png",
	},
	{
		content: "🤪",
		img: "/face_with_tongue.png",
	},
	{
		content: "😮",
		img: "/face_with_open_mouth.png",
	},
	{
		content: "😢",
		img: "/crying_face.png",
	},
	{
		content: "🤡",
		img: "/clown_face.png",
	},
];

export function NoteReaction() {
	const event = useNoteContext();

	const [open, setOpen] = useState(false);
	const [reaction, setReaction] = useState<string | null>(null);

	const getReactionImage = (content: string) => {
		const reaction: { img: string } = REACTIONS.find(
			(el) => el.content === content,
		);
		return reaction.img;
	};

	const react = async (content: string) => {
		try {
			setReaction(content);

			// react
			await event.react(content);

			setOpen(false);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<HoverCard.Root open={open} onOpenChange={setOpen}>
			<HoverCard.Trigger asChild>
				<button
					type="button"
					className="inline-flex items-center justify-center group h-7 w-7 text-neutral-600 dark:text-neutral-400"
				>
					{reaction ? (
						<img
							src={getReactionImage(reaction)}
							alt={reaction}
							className="size-6"
						/>
					) : (
						<ReactionIcon className="size-6 group-hover:text-blue-500" />
					)}
				</button>
			</HoverCard.Trigger>
			<HoverCard.Portal>
				<HoverCard.Content
					className="select-none rounded-lg bg-neutral-950 dark:bg-neutral-50 px-1 py-1 text-sm will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
					sideOffset={0}
					side="top"
				>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => react("👏")}
							className="inline-flex items-center justify-center w-8 h-8 rounded-md backdrop-blur-xl hover:bg-white/10 dark:hover:bg-black/10"
						>
							<img
								src="/clapping_hands.png"
								alt="Clapping Hands"
								className="size-6"
							/>
						</button>
						<button
							type="button"
							onClick={() => react("🤪")}
							className="inline-flex items-center justify-center w-8 h-8 rounded-md backdrop-blur-xl hover:bg-white/10 dark:hover:bg-black/10"
						>
							<img
								src="/face_with_tongue.png"
								alt="Face with Tongue"
								className="size-6"
							/>
						</button>
						<button
							type="button"
							onClick={() => react("😮")}
							className="inline-flex items-center justify-center w-8 h-8 rounded-md backdrop-blur-xl hover:bg-white/10 dark:hover:bg-black/10"
						>
							<img
								src="/face_with_open_mouth.png"
								alt="Face with Open Mouth"
								className="size-6"
							/>
						</button>
						<button
							type="button"
							onClick={() => react("😢")}
							className="inline-flex items-center justify-center w-8 h-8 rounded-md backdrop-blur-xl hover:bg-white/10 dark:hover:bg-black/10"
						>
							<img
								src="/crying_face.png"
								alt="Crying Face"
								className="size-6"
							/>
						</button>
						<button
							type="button"
							onClick={() => react("🤡")}
							className="inline-flex items-center justify-center w-8 h-8 rounded-md backdrop-blur-xl hover:bg-white/10 dark:hover:bg-black/10"
						>
							<img src="/clown_face.png" alt="Clown Face" className="size-6" />
						</button>
					</div>
					<HoverCard.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
				</HoverCard.Content>
			</HoverCard.Portal>
		</HoverCard.Root>
	);
}
