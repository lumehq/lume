import { useContext } from "react";
import { ArkContext } from "../context";

export const useArk = () => {
	const context = useContext(ArkContext);
	if (context === undefined) {
		throw new Error("useArk must be used within an ArkProvider");
	}
	return context;
};
