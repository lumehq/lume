import { Link } from "react-router-dom";

export function TutorialNewColumnScreen() {
	return (
		<div className="px-5 h-full flex flex-col justify-between">
			<div className="h-full min-h-0 flex flex-col gap-2">
				<p>Lume is column based, each column is its own experience.</p>
				<p>
					<span className="font-semibold">To create a new column</span>, you can
					click on the "Plus" icon at bottom right corner of this window.
				</p>
				<p>Click to "Plus" icon</p>
				<img
					src="/tutorial-2.gif"
					alt="tutorial-2"
					className="w-full h-auto rounded-lg"
				/>
			</div>
			<div className="h-16 w-full shrink-0 flex items-center justify-end">
				<Link
					to="/manage-column"
					className="inline-flex items-center justify-center w-20 font-semibold border-t rounded-lg border-neutral-900 dark:border-neutral-800 h-9 bg-neutral-950 text-neutral-50 dark:bg-neutral-900 hover:bg-neutral-900 dark:hover:bg-neutral-800"
				>
					Next
				</Link>
			</div>
		</div>
	);
}
