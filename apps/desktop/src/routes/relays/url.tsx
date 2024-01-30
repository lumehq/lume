import { LoaderIcon } from "@lume/icons";
import { NIP11 } from "@lume/types";
import { User } from "@lume/ui";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Await, useLoaderData, useParams } from "react-router-dom";
import { RelayEventList } from "./components/relayEventList";

export function RelayUrlScreen() {
	const { t } = useTranslation();
	const { url } = useParams();

	const data: { relay?: { [key: string]: string } } = useLoaderData();

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
				<RelayEventList relayUrl={url} />
			</div>
			<div className="col-span-1 px-3 py-3">
				<Suspense
					fallback={
						<div className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
							<LoaderIcon className="h-4 w-4 animate-spin" />
							{t("global.loading")}
						</div>
					}
				>
					<Await
						resolve={data.relay}
						errorElement={
							<div className="text-sm font-medium">
								<p>{t("relays.relayView.empty")}</p>
							</div>
						}
					>
						{(resolvedRelay: NIP11) => (
							<div className="flex flex-col gap-5">
								<div>
									<h3 className="font-semibold">{resolvedRelay.name}</h3>
									<p className="text-sm text-neutral-600 dark:text-neutral-500">
										{resolvedRelay.description}
									</p>
								</div>
								{resolvedRelay.pubkey ? (
									<div className="flex flex-col gap-1">
										<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
											{t("relays.relayView.owner")}:
										</h5>
										<div className="w-full rounded-lg bg-neutral-100 px-2 py-2 dark:bg-neutral-900">
											<User pubkey={resolvedRelay.pubkey} variant="simple" />
										</div>
									</div>
								) : null}
								{resolvedRelay.contact ? (
									<div>
										<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
											{t("relays.relayView.contact")}:
										</h5>
										<a
											href={`mailto:${resolvedRelay.contact}`}
											target="_blank"
											className="truncate underline after:content-['_↗'] hover:text-blue-500"
											rel="noreferrer"
										>
											{resolvedRelay.contact}
										</a>
									</div>
								) : null}
								<div>
									<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
										{t("relays.relayView.software")}:
									</h5>
									<a
										href={resolvedRelay.software}
										target="_blank"
										rel="noreferrer"
										className="underline after:content-['_↗'] hover:text-blue-500"
									>
										{`${getSoftwareName(resolvedRelay.software)} - ${
											resolvedRelay.version
										}`}
									</a>
								</div>
								<div>
									<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
										{t("relays.relayView.nips")}:
									</h5>
									<div className="mt-2 grid grid-cols-7 gap-2">
										{resolvedRelay.supported_nips.map((item) => (
											<a
												key={item}
												href={`https://nips.be/${item}`}
												target="_blank"
												rel="noreferrer"
												className="inline-flex aspect-square h-auto w-full items-center justify-center rounded bg-neutral-100 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-900"
											>
												{item}
											</a>
										))}
									</div>
								</div>
								{resolvedRelay.limitation ? (
									<div>
										<h5 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
											{t("relays.relayView.limit")}
										</h5>
										<div className="flex flex-col gap-2 divide-y divide-white/5">
											{Object.keys(resolvedRelay.limitation).map((key) => {
												return (
													<div
														key={key}
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
											})}
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
											{t("relays.relayView.payment")}
										</a>
										<span className="text-center text-xs text-neutral-600 dark:text-neutral-400">
											{t("relays.relayView.paymentNote")}
										</span>
									</div>
								) : null}
							</div>
						)}
					</Await>
				</Suspense>
			</div>
		</div>
	);
}
