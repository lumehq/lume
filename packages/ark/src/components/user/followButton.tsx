import { LoaderIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useArk } from "../../hooks/useArk";

export function UserFollowButton({
	target,
	className,
}: { target: string; className?: string }) {
	const ark = useArk();

	const [t] = useTranslation();
	const [loading, setLoading] = useState(false);
	const [followed, setFollowed] = useState(false);

	const toggleFollow = async () => {
		setLoading(true);
		if (!followed) {
			const add = await ark.createContact(target);
			if (add) setFollowed(true);
		} else {
			const remove = await ark.deleteContact(target);
			if (remove) setFollowed(false);
		}
		setLoading(false);
	};

	useEffect(() => {
		async function status() {
			setLoading(true);

			const contacts = await ark.getUserContacts();
			if (contacts?.includes(target)) {
				setFollowed(true);
			}

			setLoading(false);
		}
		status();
	}, []);

	return (
		<button
			type="button"
			disabled={loading}
			onClick={toggleFollow}
			className={cn("w-max", className)}
		>
			{loading ? (
				<LoaderIcon className="size-4 animate-spin" />
			) : followed ? (
				t("user.unfollow")
			) : (
				t("user.follow")
			)}
		</button>
	);
}
