import * as Avatar from "@radix-ui/react-avatar";
import { minidenticon } from "minidenticons";
import {
	Ref,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";

import { NDKCacheUserProfile } from "@lume/types";
import { cn } from "@lume/utils";

type MentionListRef = {
	onKeyDown: (props: { event: Event }) => boolean;
};

const List = (
	props: {
		items: NDKCacheUserProfile[];
		command: (arg0: { id: string }) => void;
	},
	ref: Ref<unknown>,
) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const selectItem = (index) => {
		const item = props.items[index];
		if (item) {
			props.command({ id: item.pubkey });
		}
	};

	const upHandler = () => {
		setSelectedIndex(
			(selectedIndex + props.items.length - 1) % props.items.length,
		);
	};

	const downHandler = () => {
		setSelectedIndex((selectedIndex + 1) % props.items.length);
	};

	const enterHandler = () => {
		selectItem(selectedIndex);
	};

	useEffect(() => setSelectedIndex(0), [props.items]);

	useImperativeHandle(ref, () => ({
		onKeyDown: ({ event }) => {
			if (event.key === "ArrowUp") {
				upHandler();
				return true;
			}

			if (event.key === "ArrowDown") {
				downHandler();
				return true;
			}

			if (event.key === "Enter") {
				enterHandler();
				return true;
			}

			return false;
		},
	}));

	return (
		<div className="flex w-[200px] flex-col overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-2 shadow-lg shadow-neutral-500/20 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-neutral-300/50">
			{props.items.length ? (
				props.items.map((item, index) => (
					<button
						type="button"
						key={item.pubkey}
						onClick={() => selectItem(index)}
						className={cn(
							"inline-flex h-11 items-center gap-2 rounded-md px-2",
							index === selectedIndex
								? "bg-neutral-100 dark:bg-neutral-900"
								: "",
						)}
					>
						<Avatar.Root className="h-8 w-8 shrink-0">
							<Avatar.Image
								src={item.image}
								alt={item.name}
								loading="lazy"
								decoding="async"
								className="h-8 w-8 rounded-md"
							/>
							<Avatar.Fallback delayMs={150}>
								<img
									src={`data:image/svg+xml;utf8,${encodeURIComponent(
										minidenticon(item.name, 90, 50),
									)}`}
									alt={item.name}
									className="h-8 w-8 rounded-md bg-black dark:bg-white"
								/>
							</Avatar.Fallback>
						</Avatar.Root>
						<h5 className="max-w-[150px] truncate text-sm font-medium">
							{item.name}
						</h5>
					</button>
				))
			) : (
				<div className="text-center text-sm font-medium">No result</div>
			)}
		</div>
	);
};

export const MentionList = forwardRef<MentionListRef>(List);
