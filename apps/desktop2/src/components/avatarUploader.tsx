import { NostrQuery } from "@lume/system";
import { Spinner } from "@lume/ui";
import { cn } from "@lume/utils";
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useState,
} from "react";
import { toast } from "sonner";

export function AvatarUploader({
	setPicture,
	children,
	className,
}: {
	setPicture: Dispatch<SetStateAction<string>>;
	children: ReactNode;
	className?: string;
}) {
	const [loading, setLoading] = useState(false);

	const uploadAvatar = async () => {
		try {
			setLoading(true);
			const image = await NostrQuery.upload();
			setPicture(image);
		} catch (e) {
			setLoading(false);
			toast.error(String(e));
		}
	};

	return (
		<button
			type="button"
			onClick={() => uploadAvatar()}
			className={cn("size-4", className)}
		>
			{loading ? <Spinner className="size-4" /> : children}
		</button>
	);
}
