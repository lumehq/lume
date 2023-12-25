import { ArrowLeftIcon, LoaderIcon } from "@lume/icons";
import { NIP11 } from "@lume/types";
import { User } from "@lume/ui";
import { Suspense } from "react";
import { Await, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { RelayEventList } from "./components/relayEventList";

export function RelayScreen() {
	const { url } = useParams();

	const data: { relay?: { [key: string]: string } } = useLoaderData();
	const navigate = useNavigate();

	const getSoftwareName = (url: string) => {
		const filename = url.substring(url.lastIndexOf("/") + 1);
		return filename.replace(".git", "");
	};

	const titleCase = (s: string) => {
		return s
			.replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
			.replace(/[-_]+(.)/g, (_, c) => ` ${c.toUpperCase()}`);
	};

	return (
		<div className="grid h-full w-full grid-cols-3">
			<div className="col-span-2 border-r border-neutral-100 dark:border-neutral-900">
				<div className="inline-flex h-16 w-full items-center gap-2.5 border-b border-neutral-100 px-3 dark:border-neutral-900">
					<button type="button" onClick={() => navigate(-1)}>
						<ArrowLeftIcon className="h-5 w-5 text-neutral-500 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-500" />
					</button>
					<h3 className="font-semibold text-neutral-950 dark:text-neutral-50">
						Global events
					</h3>
				</div>
				<RelayEventList relayUrl={url} />
			</div>
			<div className="col-span-1">
				<div className="inline-flex h-16 w-full items-center border-b border-neutral-100 px-3 dark:border-neutral-900">
					<h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
						Information
					</h3>
				</div>
				<div className="mt-4 px-3">
					<Suspense
						fallback={
							<div className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
								<LoaderIcon className="h-4 w-4 animate-spin" />
								Loading...
							</div>
						}
					>
						<Await
							resolve={data.relay}
							errorElement={
								<div className="text-sm font-medium">
									<p>Could not load relay information 😬</p>
								</div>
							}
						>
							{(resolvedRelay: NIP11) => (
								<div className="flex flex-col gap-5">
									<div>
										<h3 className="font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
											{resolvedRelay.name}
										</h3>
										<p className="text-sm font-medium text-neutral-600 dark:text-neutral-500">
											{resolvedRelay.description}
										</p>
									</div>
									{resolvedRelay.pubkey ? (
										<div className="flex flex-col gap-1">
											<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
												Owner:
											</h5>
											<div className="w-full rounded-lg bg-neutral-100 px-2 py-2 dark:bg-neutral-900">
												<User pubkey={resolvedRelay.pubkey} variant="simple" />
											</div>
										</div>
									) : null}
									{resolvedRelay.contact ? (
										<div>
											<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
												Contact:
											</h5>
											<a
												href={`mailto:${resolvedRelay.contact}`}
												target="_blank"
												className="underline after:content-['_↗'] hover:text-blue-600"
												rel="noreferrer"
											>
												mailto:{resolvedRelay.contact}
											</a>
										</div>
									) : null}
									<div>
										<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
											Software:
										</h5>
										<a
											href={resolvedRelay.software}
											target="_blank"
											rel="noreferrer"
											className="underline after:content-['_↗'] hover:text-blue-600"
										>
											{`${getSoftwareName(resolvedRelay.software)} - ${
												resolvedRelay.version
											}`}
										</a>
									</div>
									<div>
										<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
											Supported NIPs:
										</h5>
										<div className="mt-2 grid grid-cols-7 gap-2">
											{resolvedRelay.supported_nips.map((item) => (
												<a
													key={item}
													href={`https://nips.be/${item}`}
													target="_blank"
													rel="noreferrer"
													className="inline-flex aspect-square h-auto w-full items-center justify-center rounded-lg bg-neutral-100 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-900"
												>
													{item}
												</a>
											))}
										</div>
									</div>
									{resolvedRelay.limitation ? (
										<div>
											<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
												Limitation
											</h5>
											<div className="flex flex-col gap-2 divide-y divide-white/5">
												{Object.keys(resolvedRelay.limitation).map(
													(key, index) => {
														return (
															<div
																key={key + index}
																className="flex items-baseline justify-between pt-2"
															>
																<p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
																	{titleCase(key)}:
																</p>
																<p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
																	{resolvedRelay.limitation[key].toString()}
																</p>
															</div>
														);
													},
												)}
											</div>
										</div>
									) : null}
									{resolvedRelay.payments_url ? (
										<div className="flex flex-col gap-1">
											<a
												href={resolvedRelay.payments_url}
												target="_blank"
												rel="noreferrer"
												className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-500 text-sm font-medium hover:bg-blue-600"
											>
												Open payment website
											</a>
											<span className="text-center text-xs text-neutral-600 dark:text-neutral-400">
												You need to make a payment to connect this relay
											</span>
										</div>
									) : null}
								</div>
							)}
						</Await>
					</Suspense>
				</div>
			</div>
		</div>
	);
}
