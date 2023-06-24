import { useRouteError } from "react-router-dom";

export function ErrorScreen() {
	const error: any = useRouteError();

	return (
		<div className="w-full h-full flex items-center justify-center">
			<div>
				<h1>Oops!</h1>
				<p>Sorry, an unexpected error has occurred.</p>
				<p>
					<i>{error.statusText || error.message}</i>
				</p>
			</div>
		</div>
	);
}
