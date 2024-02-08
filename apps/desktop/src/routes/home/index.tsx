import { Timeline } from "@columns/timeline";

export function HomeScreen() {
	return (
		<div className="relative w-full h-full">
			<Timeline column={{ id: 1, kind: 1, title: "", content: "" }} />
		</div>
	);
}
