import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function AvatarUploadButton({
	setPicture,
}: {
	setPicture: Dispatch<SetStateAction<string>>;
}) {
	const ark = useArk();
	const [loading, setLoading] = useState(false);

	const uploadAvatar = async () => {
		try {
			// start loading
			setLoading(true);

			const image = await ark.upload({});

			if (image) {
				setPicture(image);
				setLoading(false);
			}

			return;
		} catch (e) {
			setLoading(false);
			toast.error(e);
		}
	};

	return (
		<button
			type="button"
			onClick={() => uploadAvatar()}
			className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-100 px-2 py-1.5 text-sm font-medium text-blue-500 hover:border-blue-300 hover:bg-blue-200 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-500 dark:hover:border-blue-800 dark:hover:bg-blue-800"
		>
			{loading ? (
				<LoaderIcon className="size-4 animate-spin" />
			) : (
				"Change avatar"
			)}
		</button>
	);
}
