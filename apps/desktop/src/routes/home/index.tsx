import { NotificationColumn } from "@columns/notification";
import { Timeline } from "@columns/timeline";
import { useStorage } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { WidgetProps } from "@lume/types";
import { WIDGET_KIND } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { VList, VListHandle } from "virtua";

export function HomeScreen() {
	const storage = useStorage();
	const ref = useRef<VListHandle>(null);

	const { isLoading, data } = useQuery({
		queryKey: ["widgets"],
		queryFn: async () => {
			const dbWidgets = await storage.getWidgets();
			const defaultWidgets = [
				{
					id: "9999",
					title: "Newsfeed",
					content: "",
					kind: WIDGET_KIND.newsfeed,
				},
			];

			return [...defaultWidgets, ...dbWidgets];
		},
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	const [selectedIndex, setSelectedIndex] = useState(-1);

	const renderItem = (widget: WidgetProps) => {
		switch (widget.kind) {
			case WIDGET_KIND.newsfeed:
				return <Timeline key={widget.id} />;
			default:
				return <Timeline key={widget.id} />;
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<LoaderIcon className="h-5 w-5 animate-spin" />
			</div>
		);
	}

	return (
		<div className="h-full w-full">
			<VList
				ref={ref}
				className="h-full w-full flex-nowrap overflow-x-auto !overflow-y-hidden scrollbar-none focus:outline-none"
				initialItemSize={420}
				tabIndex={0}
				horizontal
				onKeyDown={(e) => {
					if (!ref.current) return;
					switch (e.code) {
						case "ArrowUp":
						case "ArrowLeft": {
							e.preventDefault();
							const prevIndex = Math.max(selectedIndex - 1, 0);
							setSelectedIndex(prevIndex);
							ref.current.scrollToIndex(prevIndex, {
								align: "center",
								smooth: true,
							});
							break;
						}
						case "ArrowDown":
						case "ArrowRight": {
							e.preventDefault();
							const nextIndex = Math.min(selectedIndex + 1, data.length - 1);
							setSelectedIndex(nextIndex);
							ref.current.scrollToIndex(nextIndex, {
								align: "center",
								smooth: true,
							});
							break;
						}
						default:
							break;
					}
				}}
			>
				{data.map((widget) => renderItem(widget))}
				<div className="h-full w-[200px]" />
			</VList>
		</div>
	);
}
