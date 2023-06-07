import { navigate } from "vite-plugin-ssr/client/router";

export function NoteWrapper({
	children,
	href,
	className,
}: {
	children: React.ReactNode;
	href: string;
	className: string;
}) {
	const openThread = (event: any, href: string) => {
		const selection = window.getSelection();
		if (selection.toString().length === 0) {
			navigate(href, { keepScrollPosition: true });
		} else {
			event.stopPropagation();
		}
	};

	return <div className={className}>{children}</div>;
}
