import { useEvent } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useParams } from "react-router-dom";
import { ActivitySingleRepost } from "./components/singleRepost";
import { ActivitySingleText } from "./components/singleText";
import { ActivitySingleZap } from "./components/singleZap";

export function ActivityIdScreen() {
	const { id } = useParams();
	const { isLoading, data } = useEvent(id);

	if (isLoading || !data) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<LoaderIcon className="size-5 animate-spin" />
			</div>
		);
	}

	if (data.kind === NDKKind.Text) return <ActivitySingleText event={data} />;
	if (data.kind === NDKKind.Zap) return <ActivitySingleZap event={data} />;
	if (data.kind === NDKKind.Repost)
		return <ActivitySingleRepost event={data} />;

	return <ActivitySingleText event={data} />;
}
