import { ContactCard } from "./components/contactCard";
import { PostCard } from "./components/postCard";
import { ProfileCard } from "./components/profileCard";
import { RelayCard } from "./components/relayCard";
import { ZapCard } from "./components/zapCard";

export function UserSettingScreen() {
	return (
		<div className="mx-auto w-full max-w-xl">
			<ProfileCard />
			<div className="grid grid-cols-2 gap-4">
				<ContactCard />
				<RelayCard />
				<PostCard />
				<ZapCard />
			</div>
		</div>
	);
}
