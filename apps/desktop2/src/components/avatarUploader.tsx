import { Spinner } from "@lume/ui";
import { cn } from "@lume/utils";
import { useRouteContext } from "@tanstack/react-router";
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
	const { ark } = useRouteContext({ strict: false });
	const [loading, setLoading] = useState(false);

	const uploadAvatar = async () => {
		// start loading
		setLoading(true);
		try {
			const image = await ark.upload();
			setPicture(image);
		} catch (e) {
			toast.error(String(e));
		}

		// stop loading
		setLoading(false);
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
