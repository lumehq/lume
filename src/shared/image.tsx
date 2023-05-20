import { DEFAULT_AVATAR } from "@stores/constants";

export function Image(props) {
	const addImageFallback = (event) => {
		event.currentTarget.src = DEFAULT_AVATAR;
	};

	return (
		<img
			{...props}
			decoding="async"
			onError={addImageFallback}
			alt="lume default img"
			style={{ contentVisibility: "auto" }}
		/>
	);
}
