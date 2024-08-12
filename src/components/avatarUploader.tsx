import { cn } from "@/commons";
import { Spinner } from "@/components";
import { NostrQuery } from "@/system";
import { message } from "@tauri-apps/plugin-dialog";
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useState,
} from "react";

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
			await message(String(e), { title: "Lume", kind: "error" });
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
