import { ReactNode } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

export function Link({
	href,
	className,
	children,
}: { href: string; className?: string; children: ReactNode }) {
	const goto = () => {
		navigate(href, { keepScrollPosition: true });
	};

	return (
		<button type="button" onClick={() => goto()} className={className}>
			{children}
		</button>
	);
}
