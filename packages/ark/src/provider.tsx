import { PropsWithChildren, createContext, useEffect, useMemo } from "react";
import { Ark } from "./ark";

export const ArkContext = createContext<Ark>(undefined);

export const ArkProvider = ({ children }: PropsWithChildren<object>) => {
	const ark = useMemo(() => new Ark(), []);
	return <ArkContext.Provider value={ark}>{children}</ArkContext.Provider>;
};
