import { Route } from "react-router-dom";
import { ColumnContent } from "./content";
import { ColumnHeader } from "./header";
import { ColumnLiveWidget } from "./live";
import { ColumnRoot } from "./root";

export const Column = {
	Root: ColumnRoot,
	Live: ColumnLiveWidget,
	Header: ColumnHeader,
	Content: ColumnContent,
	Route: Route,
};

export * from "./provider";
