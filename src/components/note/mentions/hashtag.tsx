import { LumeWindow } from "@/system";

export function Hashtag({ tag }: { tag: string }) {
	return (
		<button
			type="button"
			onClick={() => LumeWindow.openHashtag(tag)}
			className="leading-normal cursor-default text-blue-500 hover:text-blue-600 font-normal"
		>
			{tag}
		</button>
	);
}
