import { usePageContext } from "@utils/hooks/usePageContext";
import { twMerge } from "tailwind-merge";

export function ActiveLink({
	href,
	className,
	activeClassName,
	children,
}: {
	href: string;
	className: string;
	activeClassName: string;
	children: React.ReactNode;
}) {
	const pageContext = usePageContext();
	const pathName = pageContext.urlPathname;

	return (
		<a
			href={href}
			className={twMerge(className, href === pathName ? activeClassName : "")}
		>
			{children}
		</a>
	);
}
