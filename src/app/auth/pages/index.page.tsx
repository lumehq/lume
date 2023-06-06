export function Page() {
	return (
		<div className="flex flex-col justify-between h-full w-full">
			<div className="w-full h-full flex flex-col justify-center items-center gap-4 overflow-hidden">
				<h1 className="animate-moveBg bg-gradient-to-r from-fuchsia-400 via-green-200 to-orange-400 bg-clip-text text-5xl font-bold leading-none text-transparent">
					Preserve your freedom
				</h1>
				<div className="mt-4 flex flex-col gap-1.5">
					<a
						href="/app/auth/import"
						className="inline-flex h-14 w-64 items-center justify-center gap-2 rounded-lg px-6 font-medium text-zinc-200 hover:bg-zinc-900"
					>
						Login with private key
					</a>
					<a
						href="/app/auth/create"
						className="inline-flex h-14 w-64 items-center justify-center gap-2 rounded-lg px-6 font-medium text-zinc-200 hover:bg-zinc-900"
					>
						Create new key
					</a>
				</div>
			</div>
			<div className="overflow-hidden" />
		</div>
	);
}
