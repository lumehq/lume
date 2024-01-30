import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function AvatarUpload({ setPicture }) {
	const ark = useArk();

	const [t] = useTranslation();
	const [loading, setLoading] = useState(false);

	const upload = async () => {
		try {
			setLoading(true);

			// upload image to nostr.build server
			// #TODO: support multiple server
			const image = await ark.upload({ fileExts: [] });

			if (!image)
				toast.error("Failed to upload image, please try again later.");

			setPicture(image);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			toast.error("Failed to upload image, please try again later.");
		}
	};

	return (
		<button
			type="button"
			onClick={upload}
			disabled={loading}
			className="inline-flex items-center justify-center w-36 font-medium rounded-lg h-8 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
		>
			{loading ? (
				<LoaderIcon className="size-4 animate-spin" />
			) : (
				t("user.avatarButton")
			)}
		</button>
	);
}
