import { ReactNode } from "react";
import { Routes } from "react-router-dom";

export function ColumnContent({ children }: { children: ReactNode }) {
	return <Routes>{children}</Routes>;
}
