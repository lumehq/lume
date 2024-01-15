import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import * as Dialog from "@radix-ui/react-dialog";
import { fetch } from "@tauri-apps/plugin-http";
import { useState } from "react";
import { toast } from "sonner";
import { renderSVG } from "uqr";

export function TranslateRegisterModal({ setAPIKey }) {
	const ark = useArk();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [invoice, setInvoice] = useState<{ api_key: string; bolt11: string }>(
		null,
	);

	const createInvoice = async () => {
		try {
			setLoading(true);

			const res = await fetch("https://translate.nostr.wine/api/create", {
				method: "POST",
				body: JSON.stringify({
					pubkey: ark.account.pubkey,
					amount: 2500,
				}),
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
			});

			if (res) {
				const data = await res.json();
				setInvoice(data);
				setLoading(false);
			}
		} catch (e) {
			setLoading(false);
			toast.error(String(e));
		}
	};

	const finish = () => {
		if (!invoice) return;

		setAPIKey(invoice.api_key);
		setOpen(false);
	};

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="mt-2 w-full h-11 rounded-lg bg-neutral-900 font-medium inline-flex items-center justify-center"
				>
					Register
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10" />
				<Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center min-h-full">
					<div className="flex flex-col justify-between w-full max-w-lg h-[500px] rounded-xl bg-black text-neutral-50 overflow-hidden">
						<div className="h-12 shrink-0 px-8 border-b border-neutral-950 flex font-medium w-full items-center justify-center">
							Register Translate Service
						</div>
						<div className="flex-1 min-h-0 flex flex-col justify-between px-8 py-8">
							<div className="flex flex-col gap-1.5">
								<p className="text-sm text-neutral-500">
									Translate Service is provided by{" "}
									<span className="text-blue-500">nostr.wine</span>, you need to
									deposit at least 2,500 sats to use translate 50,000 characters
								</p>
								<p className="text-sm text-neutral-500">
									You can learn more about nostr.wine{" "}
									<a
										href="https://nostr.wine/"
										target="_blank"
										className="text-blue-500 hover:text-blue-600"
										rel="noreferrer"
									>
										here
									</a>
								</p>
							</div>
							{!invoice ? (
								<div className="flex flex-col gap-5">
									<img
										src="/translate.jpg"
										srcSet="/translate@2x.jpg 2x"
										alt="translate"
										className="w-full h-auto object-cover rounded-lg"
									/>
									<button
										type="button"
										onClick={createInvoice}
										className="w-full h-10 shrink-0 rounded-lg bg-blue-500 hover:bg-blue-600 text-white inline-flex items-center justify-center font-medium"
									>
										{loading ? (
											<LoaderIcon className="size-5 animate-spin" />
										) : (
											"Create Invoice"
										)}
									</button>
								</div>
							) : (
								<div className="flex flex-col gap-5">
									<div className="flex flex-col gap-1">
										<h3 className="font-semibold">API Key</h3>
										<input
											type="text"
											readOnly
											value={invoice.api_key}
											className="w-full border-transparent outline-none focus:outline-none focus:ring-0 focus:border-none h-11 rounded-lg ring-0 placeholder:text-neutral-600 bg-neutral-950"
										/>
									</div>
									<div className="w-full rounded-lg h-56 gap-3 flex flex-col items-center justify-center bg-neutral-950">
										<img
											src={`data:image/svg+xml;utf8,${renderSVG(
												invoice.bolt11,
											)}`}
											alt={invoice.api_key}
											className="bg-white w-36 h-36"
										/>
										<p className="text-sm text-neutral-400">
											Scan and Pay with Lightning Wallet
										</p>
									</div>
									<button
										type="button"
										onClick={finish}
										className="w-full h-10 shrink-0 rounded-lg bg-blue-500 hover:bg-blue-600 text-white inline-flex items-center justify-center font-medium"
									>
										Done
									</button>
								</div>
							)}
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
