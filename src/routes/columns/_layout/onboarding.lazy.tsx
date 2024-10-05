import * as ScrollArea from "@radix-ui/react-scroll-area";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/columns/_layout/onboarding")({
	component: Screen,
});

function Screen() {
	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport className="relative h-full px-3 pb-3">
				<div className="my-10 text-center flex flex-col items-center justify-center">
					<h1 className="text-2xl font-serif font-medium">Welcome to Lume</h1>
					<p className="leading-tight text-neutral-700 dark:text-neutral-300">
						Here are a few suggestions to help you get started.
					</p>
				</div>
				<div className="flex flex-col gap-3">
					<div className="relative flex flex-col items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-800">
						<div className="absolute top-2 left-3 text-2xl font-semibold font-serif text-neutral-600 dark:text-neutral-400">
							01.
						</div>
						<div className="h-16 flex items-center justify-center shrink-0 px-3 text-lg select-text">
							Navigate between columns.
						</div>
						<div className="flex-1 w-3/4 h-full pb-10">
							<video
								className="h-auto w-full rounded-lg shadow-md"
								controls
								muted
								preload="none"
								poster="https://image.nostr.build/143354665d94b20013fde14ad05e53e958e11eec568a11b273921d1808c410cc.png"
							>
								<source
									src="https://video.nostr.build/8fc3598ef85a1be292cee4ad6ad85b2c8bbf86da0aefd693e60416b56ec96e5f.mp4"
									type="video/mp4"
								/>
								Your browser does not support the video tag.
							</video>
						</div>
					</div>
					<div className="relative flex flex-col items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-800">
						<div className="absolute top-2 left-3 text-2xl font-semibold font-serif text-neutral-600 dark:text-neutral-400">
							02.
						</div>
						<div className="h-16 flex items-center justify-center shrink-0 px-3 text-lg select-text">
							Add a new column.
						</div>
						<div className="flex-1 w-3/4 h-full pb-10">
							<video
								className="h-auto w-full rounded-lg shadow-md"
								controls
								muted
								preload="none"
								poster="https://image.nostr.build/216015bc81931725c23171700b4d2d73556ecfe3efe662afd7eea6627574b506.png"
							>
								<source
									src="https://video.nostr.build/cdb842a1ffc6864bab009a668f68acb0a672e04e9538dbe7e2ac44182722d956.mp4"
									type="video/mp4"
								/>
								Your browser does not support the video tag.
							</video>
						</div>
					</div>
					<div className="relative flex flex-col items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-800">
						<div className="absolute top-2 left-3 text-2xl font-semibold font-serif text-neutral-600 dark:text-neutral-400">
							03.
						</div>
						<div className="h-16 flex items-center justify-center shrink-0 px-3 text-lg select-text">
							View a thread.
						</div>
						<div className="flex-1 w-3/4 h-full pb-10">
							<video
								className="h-auto w-full rounded-lg shadow-md"
								controls
								muted
								preload="none"
								poster="https://image.nostr.build/3a3ead93bc64224e6397df4097998708b5aef4c6e7104f8e28c77db47ad1625a.png"
							>
								<source
									src="https://video.nostr.build/088636b03976a4e54c5053c718300816a7c3f9f361a1fe7d8e7a0f663ab6a582.mp4"
									type="video/mp4"
								/>
								Your browser does not support the video tag.
							</video>
						</div>
					</div>
				</div>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
				orientation="vertical"
			>
				<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner className="bg-transparent" />
		</ScrollArea.Root>
	);
}
