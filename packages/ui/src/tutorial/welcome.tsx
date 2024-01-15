import { Link } from "react-router-dom";

export function TutorialWelcomeScreen() {
	return (
		<div className="px-5 h-full flex flex-col justify-between">
			<div className="h-full min-h-0 flex flex-col gap-2">
				<p>
					<span className="font-semibold">Welcome to your Home Screen.</span>{" "}
					This is your personalized screen, which you can customize to you
					liking
				</p>
				<p>Feel free to make adjustments as needed.</p>
				<p>Let's take a few minutes to explore the features together.</p>
				<img
					src="/tutorial-1.gif"
					alt="tutorial-1"
					className="w-full h-auto rounded-lg"
				/>
			</div>
			<div className="h-16 w-full shrink-0 flex items-center justify-end">
				<Link
					to="/new-column"
					className="inline-flex items-center justify-center w-20 font-semibold border-t rounded-lg border-neutral-900 dark:border-neutral-800 h-9 bg-neutral-950 text-neutral-50 dark:bg-neutral-900 hover:bg-neutral-900 dark:hover:bg-neutral-800"
				>
					Next
				</Link>
			</div>
		</div>
	);
}
