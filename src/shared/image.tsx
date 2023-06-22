import { DEFAULT_AVATAR } from "@stores/constants";
import { ClassAttributes, ImgHTMLAttributes, JSX } from "react";

export function Image(
	props: JSX.IntrinsicAttributes &
		ClassAttributes<HTMLImageElement> &
		ImgHTMLAttributes<HTMLImageElement>,
	fallback = undefined,
) {
	const addImageFallback = (event: { currentTarget: { src: string } }) => {
		event.currentTarget.src = fallback ? fallback : DEFAULT_AVATAR;
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
