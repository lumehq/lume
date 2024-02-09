import { Route } from "react-router-dom";
import { ColumnContent } from "./content";
import { ColumnHeader } from "./header";
import { ColumnLiveWidget } from "./live";
import { ColumnProvider } from "./provider";
import { ColumnRoot } from "./root";

export const Column = {
	Provider: ColumnProvider,
	Root: ColumnRoot,
	Live: ColumnLiveWidget,
	Header: ColumnHeader,
	Content: ColumnContent,
	Route: Route,
};
