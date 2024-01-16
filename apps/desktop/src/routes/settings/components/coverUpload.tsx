import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { useState } from "react";
import { toast } from "sonner";

export function CoverUpload({ setBanner }) {
	const ark = useArk();
	const [loading, setLoading] = useState(false);

	const upload = async () => {
		try {
			setLoading(true);

			// upload image to nostr.build server
			// #TODO: support multiple server
			const image = await ark.upload({ fileExts: [] });

			if (!image)
				toast.error("Failed to upload image, please try again later.");

			setBanner(image);
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
			className="inline-flex items-center justify-center w-32 font-medium rounded-lg h-8 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
		>
			{loading ? (
				<LoaderIcon className="size-4 animate-spin" />
			) : (
				"Change cover"
			)}
		</button>
	);
}
