import { cn } from "@lume/utils";
import { useEffect, useState } from "react";
import { useArk } from "../../hooks/useArk";

export function UserFollowButton({
	target,
	className,
}: { target: string; className?: string }) {
	const ark = useArk();
	const [followed, setFollowed] = useState(false);

	const toggleFollow = async () => {
		if (!followed) {
			const add = await ark.createContact(target);
			if (add) setFollowed(true);
		} else {
			const remove = await ark.deleteContact(target);
			if (remove) setFollowed(false);
		}
	};

	useEffect(() => {
		async function status() {
			const contacts = await ark.getUserContacts();
			if (contacts?.includes(target)) setFollowed(true);
		}
		status();
	}, []);

	return (
		<button type="button" onClick={toggleFollow} className={cn("", className)}>
			{followed ? "Unfollow" : "Follow"}
		</button>
	);
}
