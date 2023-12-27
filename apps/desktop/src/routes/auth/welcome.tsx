import { Link } from "react-router-dom";

export function WelcomeScreen() {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-10">
			<div className="mx-auto max-w-md flex w-full text-center flex-col items-center">
				<h1 className="mb-2 text-4xl font-semibold">Welcome to Nostr!</h1>
			</div>
			<div className="flex flex-col gap-2 px-8 mx-auto max-w-sm">
				<Link
					to="/auth/create"
					className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600"
				>
					Create new account
				</Link>
				<Link
					to="/auth/import"
					className="inline-flex h-11 w-full items-center justify-center rounded-lg font-medium text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
				>
					Log in
				</Link>
			</div>
		</div>
	);
}
