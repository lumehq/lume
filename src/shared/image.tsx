import { DEFAULT_AVATAR } from "@stores/constants";

export function Image(props, fallback?) {
	const addImageFallback = (event: { currentTarget: { src: string } }) => {
		event.currentTarget.src = fallback || DEFAULT_AVATAR;
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
