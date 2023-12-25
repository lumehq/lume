import { RelayList } from "./components/relayList";
import { UserRelayList } from "./components/userRelayList";

export function RelaysScreen() {
	return (
		<div className="grid h-full w-full grid-cols-3">
			<RelayList />
			<UserRelayList />
		</div>
	);
}
