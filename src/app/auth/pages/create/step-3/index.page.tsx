import { User } from "@app/auth/components/user";
import { CheckCircleIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { WRITEONLY_RELAYS } from "@stores/constants";
import { updateAccount } from "@utils/storage";
import { arrayToNIP02 } from "@utils/transform";
import { getEventHash, getSignature } from "nostr-tools";
import { useContext, useState } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

const initialList = [
	{
		pubkey: "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2",
	},
	{
		pubkey: "a341f45ff9758f570a21b000c17d4e53a3a497c8397f26c0e6d61e5acffc7a98",
	},
	{
		pubkey: "04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9",
	},
	{
		pubkey: "c4eabae1be3cf657bc1855ee05e69de9f059cb7a059227168b80b89761cbc4e0",
	},
	{
		pubkey: "6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93",
	},
	{
		pubkey: "e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411",
	},
	{
		pubkey: "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d",
	},
	{
		pubkey: "c49d52a573366792b9a6e4851587c28042fb24fa5625c6d67b8c95c8751aca15",
	},
	{
		pubkey: "e33fe65f1fde44c6dc17eeb38fdad0fceaf1cae8722084332ed1e32496291d42",
	},
	{
		pubkey: "84dee6e676e5bb67b4ad4e042cf70cbd8681155db535942fcc6a0533858a7240",
	},
	{
		pubkey: "703e26b4f8bc0fa57f99d815dbb75b086012acc24fc557befa310f5aa08d1898",
	},
	{
		pubkey: "bf2376e17ba4ec269d10fcc996a4746b451152be9031fa48e74553dde5526bce",
	},
	{
		pubkey: "4523be58d395b1b196a9b8c82b038b6895cb02b683d0c253a955068dba1facd0",
	},
	{
		pubkey: "c9b19ffcd43e6a5f23b3d27106ce19e4ad2df89ba1031dd4617f1b591e108965",
	},
	{
		pubkey: "c7dccba4fe4426a7b1ea239a5637ba40fab9862c8c86b3330fe65e9f667435f6",
	},
	{
		pubkey: "6e1534f56fc9e937e06237c8ba4b5662bcacc4e1a3cfab9c16d89390bec4fca3",
	},
	{
		pubkey: "50d94fc2d8580c682b071a542f8b1e31a200b0508bab95a33bef0855df281d63",
	},
	{
		pubkey: "3d2e51508699f98f0f2bdbe7a45b673c687fe6420f466dc296d90b908d51d594",
	},
	{
		pubkey: "6e3f51664e19e082df5217fd4492bb96907405a0b27028671dd7f297b688608c",
	},
	{
		pubkey: "2edbcea694d164629854a52583458fd6d965b161e3c48b57d3aff01940558884",
	},
	{
		pubkey: "3f770d65d3a764a9c5cb503ae123e62ec7598ad035d836e2a810f3877a745b24",
	},
	{
		pubkey: "eab0e756d32b80bcd464f3d844b8040303075a13eabc3599a762c9ac7ab91f4f",
	},
	{
		pubkey: "be1d89794bf92de5dd64c1e60f6a2c70c140abac9932418fee30c5c637fe9479",
	},
	{
		pubkey: "a5e93aef8e820cbc7ab7b6205f854b87aed4b48c5f6b30fbbeba5c99e40dcf3f",
	},
	{
		pubkey: "1989034e56b8f606c724f45a12ce84a11841621aaf7182a1f6564380b9c4276b",
	},
	{
		pubkey: "c48b5cced5ada74db078df6b00fa53fc1139d73bf0ed16de325d52220211dbd5",
	},
	{
		pubkey: "460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c",
	},
	{
		pubkey: "7f3b464b9ff3623630485060cbda3a7790131c5339a7803bde8feb79a5e1b06a",
	},
	{
		pubkey: "b99dbca0184a32ce55904cb267b22e434823c97f418f36daf5d2dff0dd7b5c27",
	},
	{
		pubkey: "e9e4276490374a0daf7759fd5f475deff6ffb9b0fc5fa98c902b5f4b2fe3bba2",
	},
	{
		pubkey: "ea2e3c814d08a378f8a5b8faecb2884d05855975c5ca4b5c25e2d6f936286f14",
	},
	{
		pubkey: "ff04a0e6cd80c141b0b55825fed127d4532a6eecdb7e743a38a3c28bf9f44609",
	},
];

export function Page() {
	const pool: any = useContext(RelayContext);

	const [account, updateFollows] = useActiveAccount((state: any) => [
		state.account,
		state.updateFollows,
	]);
	const [loading, setLoading] = useState(false);
	const [follows, setFollows] = useState([]);

	// toggle follow state
	const toggleFollow = (pubkey: string) => {
		const arr = follows.includes(pubkey)
			? follows.filter((i) => i !== pubkey)
			: [...follows, pubkey];
		setFollows(arr);
	};

	// save follows to database then broadcast
	const submit = async () => {
		setLoading(true);

		// update account follows in database
		updateAccount("follows", follows, account.pubkey);

		// update account follows in state
		updateFollows(JSON.stringify(follows));

		const tags = arrayToNIP02(follows);

		const event: any = {
			content: "",
			created_at: Math.floor(Date.now() / 1000),
			kind: 3,
			pubkey: account.pubkey,
			tags: tags,
		};

		event.id = getEventHash(event);
		event.sig = getSignature(event, account.privkey);

		// publish
		pool.publish(event, WRITEONLY_RELAYS);

		// redirect to step 3
		setTimeout(
			() =>
				navigate("/app/prefetch", {
					overwriteLastHistoryEntry: true,
				}),
			2000,
		);
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="mx-auto w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-xl font-semibold text-white">
						Personalized your newsfeed
					</h1>
				</div>
				<div className="flex flex-col gap-4">
					<div className="w-full rounded-lg border border-zinc-800 bg-zinc-900">
						<div className="inline-flex h-10 w-full items-center gap-1 border-b border-zinc-800 px-4 text-base font-medium text-zinc-400">
							Follow at least
							<span className="bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 bg-clip-text font-bold text-transparent">
								{follows.length}/10
							</span>{" "}
							plebs
						</div>
						<div className="scrollbar-hide flex h-96 flex-col overflow-y-auto py-2">
							{initialList.map((item: { pubkey: string }, index: number) => (
								<button
									key={`item-${index}`}
									type="button"
									onClick={() => toggleFollow(item.pubkey)}
									className="inline-flex transform items-center justify-between bg-zinc-900 px-4 py-2 hover:bg-zinc-800 active:translate-y-1"
								>
									<User pubkey={item.pubkey} />
									{follows.includes(item.pubkey) && (
										<div>
											<CheckCircleIcon
												width={16}
												height={16}
												className="text-green-400"
											/>
										</div>
									)}
								</button>
							))}
						</div>
					</div>
					{follows.length >= 10 && (
						<button
							type="button"
							onClick={() => submit()}
							className="inline-flex h-10 w-full transform items-center justify-center rounded-lg bg-fuchsia-500 px-3.5 font-medium text-white shadow-button hover:bg-fuchsia-600 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{loading === true ? (
								<svg
									className="h-5 w-5 animate-spin text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<title id="loading">Loading</title>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
							) : (
								<span>Continue →</span>
							)}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
