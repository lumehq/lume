import { usePageContext } from "@utils/hooks/usePageContext";

export function Page() {
	const pageContext = usePageContext();
	const searchParams: any = pageContext.urlParsed.search;
	const pubkey = searchParams.pubkey;

	return (
		<div className="h-full w-full flex flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
			<p>{pubkey}</p>
		</div>
	);
}
