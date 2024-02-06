import { PropsWithChildren, useEffect, useState } from "react";
import { Ark } from "./ark";
import { LumeContext } from "./context";

export const LumeProvider = ({ children }: PropsWithChildren<object>) => {
	const [ark, setArk] = useState<Ark>(undefined);

	useEffect(() => {
		async function setupArk() {
			const _ark = new Ark();
			setArk(_ark);
		}

		if (!ark) setupArk();
	}, []);

	return <LumeContext.Provider value={ark}>{children}</LumeContext.Provider>;
};
