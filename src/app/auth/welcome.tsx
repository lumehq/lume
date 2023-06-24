import { ArrowRightCircleIcon } from "@shared/icons/arrowRightCircle";
import { Link } from "react-router-dom";

export function WelcomeScreen() {
	return (
		<div className="w-full h-full grid grid-cols-12 gap-4 px-4 py-4">
			<div className="col-span-5 border-t border-zinc-800/50 bg-zinc-900 rounded-xl flex flex-col">
				<div className="w-full h-full flex flex-col justify-center px-4 py-4 gap-2">
					<h1 className="text-zinc-700 text-4xl font-bold leading-none text-transparent">
						Preserve your <span className="text-fuchsia-300">freedom</span>
					</h1>
					<h2 className="text-zinc-700 text-4xl font-bold leading-none text-transparent">
						Protect your <span className="text-red-300">future</span>
					</h2>
					<h3 className="text-zinc-700 text-4xl font-bold leading-none text-transparent">
						Stack <span className="text-orange-300">bitcoin</span>
					</h3>
					<h3 className="text-zinc-700 text-4xl font-bold leading-none text-transparent">
						Use <span className="text-purple-300">nostr</span>
					</h3>
				</div>
				<div className="mt-auto w-full flex flex-col gap-2 px-4 py-4">
					<Link
						to="/auth/import"
						className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg px-6 font-medium text-zinc-100 bg-fuchsia-500 hover:bg-fuchsia-600"
					>
						<span className="w-5" />
						<span>Login with private key</span>
						<ArrowRightCircleIcon className="w-5 h-5" />
					</Link>
					<Link
						to="/auth/create"
						className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg px-6 font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
					>
						Create new key
					</Link>
				</div>
			</div>
			<div
				className="col-span-5 bg-zinc-900 rounded-xl bg-cover bg-center"
				style={{
					backgroundImage: `url("https://void.cat/d/Ps1b36vu5pdkEA2w75usuB")`,
				}}
			/>
			<div
				className="col-span-2 bg-zinc-900 rounded-xl bg-cover bg-center"
				style={{
					backgroundImage: `url("https://void.cat/d/5FdJcBP5ZXKAjYqV8hpcp3")`,
				}}
			/>
		</div>
	);
}
