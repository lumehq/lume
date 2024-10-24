import { type Mention, commands } from "@/commands.gen";
import { createFileRoute, defer } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { nip19 } from "nostr-tools";

type EditorSearch = {
	reply_to: string;
	quote: string;
};

export const Route = createFileRoute("/new-post/")({
	validateSearch: (search: Record<string, string>): EditorSearch => {
		return {
			reply_to: search.reply_to,
			quote: search.quote,
		};
	},
	beforeLoad: async ({ search }) => {
		let initialValue: string;

		if (search?.quote?.length) {
			initialValue = `\nnostr:${nip19.noteEncode(search.quote)}`;
		} else {
			initialValue = "";
		}

		const accounts = await commands.getAccounts();

		return { accounts, initialValue };
	},
	loader: async () => {
		const query: Promise<Array<Mention>> = invoke("get_all_profiles");
		return { deferMentionList: defer(query) };
	},
});
