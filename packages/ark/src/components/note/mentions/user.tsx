import { WIDGET_KIND } from "@lume/utils";
import { memo } from "react";
import { useProfile } from "../../../hooks/useProfile";
import { useWidget } from "../../../hooks/useWidget";

export const MentionUser = memo(function MentionUser({
	pubkey,
}: { pubkey: string }) {
	const { user } = useProfile(pubkey);
	const { addWidget } = useWidget();

	return (
		<button
			type="button"
			onClick={() =>
				addWidget.mutate({
					kind: WIDGET_KIND.user,
					title: user?.name || user?.display_name || user?.displayName,
					content: pubkey,
				})
			}
			className="break-words text-blue-500 hover:text-blue-600"
		>
			{`@${user?.name || user?.displayName || user?.username || "unknown"}`}
		</button>
	);
});
