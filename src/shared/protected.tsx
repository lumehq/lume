import { useAccount } from "@utils/hooks/useAccount";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export function Protected({ children }: { children: ReactNode }) {
	const { status, account } = useAccount();

	if (status === "success" && !account) {
		return <Navigate to="/auth/welcome" replace />;
	}

	return children;
}
