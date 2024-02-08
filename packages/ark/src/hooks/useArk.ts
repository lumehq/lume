import { useContext } from "react";
import { ArkContext } from "../provider";

export const useArk = () => {
	const context = useContext(ArkContext);
	if (context === undefined) {
		throw new Error("Please import Ark Provider to use useArk() hook");
	}
	return context;
};
