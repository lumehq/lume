import { CommandIcon } from "@shared/icons";

export function ShortcutsSettingsScreen() {
	return (
		<div className="w-full h-full px-3 pt-12">
			<div className="flex flex-col gap-2">
				<h1 className="text-lg font-semibold text-zinc-100">Shortcuts</h1>
				<div className="w-full bg-zinc-900 border-t border-zinc-800/50 rounded-xl">
					<div className="w-full h-full flex flex-col divide-y divide-zinc-800">
						<div className="px-5 py-4 inline-flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<span className="leading-none font-medium text-zinc-200">
									Open composer
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<CommandIcon
										width={12}
										height={12}
										className="text-zinc-500"
									/>
								</div>
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<span className="text-zinc-500 text-sm leading-none">N</span>
								</div>
							</div>
						</div>
						<div className="px-5 py-4 inline-flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<span className="leading-none font-medium text-zinc-200">
									Add image block
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<CommandIcon
										width={12}
										height={12}
										className="text-zinc-500"
									/>
								</div>
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<span className="text-zinc-500 text-sm leading-none">I</span>
								</div>
							</div>
						</div>
						<div className="px-5 py-4 inline-flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<span className="leading-none font-medium text-zinc-200">
									Add newsfeed block
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<CommandIcon
										width={12}
										height={12}
										className="text-zinc-500"
									/>
								</div>
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<span className="text-zinc-500 text-sm leading-none">F</span>
								</div>
							</div>
						</div>
						<div className="px-5 py-4 inline-flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<span className="leading-none font-medium text-zinc-200">
									Open personal page
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<CommandIcon
										width={12}
										height={12}
										className="text-zinc-500"
									/>
								</div>
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<span className="text-zinc-500 text-sm leading-none">P</span>
								</div>
							</div>
						</div>
						<div className="px-5 py-4 inline-flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<span className="leading-none font-medium text-zinc-200">
									Open notification
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<CommandIcon
										width={12}
										height={12}
										className="text-zinc-500"
									/>
								</div>
								<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
									<span className="text-zinc-500 text-sm leading-none">B</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
