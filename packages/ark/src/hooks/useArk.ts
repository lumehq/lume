import { useContext } from "react";
import { LumeContext } from "../context";

export const useArk = () => {
	const context = useContext(LumeContext);
	if (context === undefined) {
		throw new Error("Please import Ark Provider to use useArk() hook");
	}
	return context;
};
