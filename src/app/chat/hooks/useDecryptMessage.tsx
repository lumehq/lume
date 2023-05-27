import { nip04 } from "nostr-tools";
import { useEffect, useState } from "react";

export function useDecryptMessage(data: any, userPriv: string) {
	const [content, setContent] = useState(data.content);

	useEffect(() => {
		async function decrypt() {
			const result = await nip04.decrypt(
				userPriv,
				data.sender_pubkey,
				data.content,
			);
			setContent(result);
		}

		decrypt().catch(console.error);
	}, []);

	return content;
}
