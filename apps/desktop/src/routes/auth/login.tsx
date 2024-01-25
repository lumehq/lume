import { Link } from "react-router-dom";

export function LoginScreen() {
	return (
		<div className="relative flex items-center justify-center w-full h-full">
			<div className="flex flex-col w-full max-w-md gap-8 mx-auto">
				<div className="flex flex-col gap-1 text-center items-center">
					<h1 className="text-2xl font-semibold">Welcome back, anon!</h1>
				</div>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Link
							to="/auth/login-oauth"
							className="inline-flex items-center justify-center w-full h-12 text-lg font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600"
						>
							Login with Nostr Address
						</Link>
						<Link
							to="/auth/login-nsecbunker"
							className="inline-flex items-center justify-center w-full h-12 text-lg font-medium text-neutral-50 rounded-xl bg-neutral-950 hover:bg-neutral-900"
						>
							Login with nsecBunker
						</Link>
					</div>
					<div className="flex flex-col gap-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-neutral-900" />
							</div>
							<div className="relative flex justify-center">
								<span className="px-2 font-medium bg-black text-neutral-600">
									Or continue with
								</span>
							</div>
						</div>
						<div>
							<Link
								to="/auth/login-key"
								className="mb-2 inline-flex items-center justify-center w-full h-12 text-lg font-medium text-neutral-50 rounded-xl bg-neutral-950 hover:bg-neutral-900"
							>
								Login with Private Key
							</Link>
							<p className="text-sm text-center text-neutral-500">
								Lume will put your Private Key in{" "}
								<span className="text-teal-600">Secure Storage</span> depended
								on your OS Platform. It will be secured by Password or Biometric
								ID
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
