import { useArk } from "@lume/ark";
import { CheckIcon, ChevronDownIcon, LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { onboardingAtom } from "@lume/utils";
import NDK, {
	NDKEvent,
	NDKKind,
	NDKNip46Signer,
	NDKPrivateKeySigner,
} from "@nostr-dev-kit/ndk";
import * as Select from "@radix-ui/react-select";
import { UnlistenFn } from "@tauri-apps/api/event";
import { desktopDir } from "@tauri-apps/api/path";
import { Window } from "@tauri-apps/api/window";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { getPublicKey, nip19 } from "nostr-tools";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Item = ({ event }: { event: NDKEvent }) => {
	const domain = JSON.parse(event.content).nip05.replace("_@", "");

	return (
		<Select.Item
			value={event.id}
			className="relative flex items-center pr-10 leading-none rounded-md select-none text-neutral-100 rounded-mg h-9 pl-7"
		>
			<Select.ItemText>@{domain}</Select.ItemText>
			<Select.ItemIndicator className="absolute left-0 inline-flex items-center justify-center transform h-7">
				<CheckIcon className="size-4" />
			</Select.ItemIndicator>
		</Select.Item>
	);
};

export function CreateAccountScreen() {
	const ark = useArk();
	const storage = useStorage();
	const services = useLoaderData() as NDKEvent[];
	const setOnboarding = useSetAtom(onboardingAtom);
	const navigate = useNavigate();

	const [serviceId, setServiceId] = useState(services?.[0]?.id);
	const [loading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm();

	const getDomainName = (id: string) => {
		const event = services.find((ev) => ev.id === id);
		return JSON.parse(event.content).nip05.replace("_@", "") as string;
	};

	const generateNostrKeys = async () => {
		const signer = NDKPrivateKeySigner.generate();
		const pubkey = getPublicKey(signer.privateKey);

		const npub = nip19.npubEncode(pubkey);
		const nsec = nip19.nsecEncode(signer.privateKey);

		ark.updateNostrSigner({ signer });

		const downloadPath = await desktopDir();
		const fileName = `nostr_keys_${nanoid(4)}.txt`;
		const filePath = await save({
			defaultPath: `${downloadPath}/${fileName}`,
		});

		if (!filePath) {
			return toast.info("You need to save account keys before continue.");
		}

		await writeTextFile(
			filePath,
			`Nostr Account\nGenerated by Lume (lume.nu)\n---\nPublic key: ${npub}\nPrivate key: ${nsec}`,
		);

		await storage.createAccount({
			pubkey: pubkey,
			privkey: signer.privateKey,
		});

		setOnboarding({ open: true, newUser: true });

		return navigate("/auth/onboarding", { replace: true });
	};

	const onSubmit = async (data: { username: string; email: string }) => {
		try {
			setIsLoading(true);

			const domain = getDomainName(serviceId);
			const service = services.find((ev) => ev.id === serviceId);

			// generate ndk for nsecbunker
			const localSigner = NDKPrivateKeySigner.generate();
			const bunker = new NDK({
				explicitRelayUrls: [
					"wss://relay.nsecbunker.com/",
					"wss://nostr.vulpem.com/",
				],
			});
			await bunker.connect(2000);

			// generate tmp remote singer for create account
			const remoteSigner = new NDKNip46Signer(
				bunker,
				service.pubkey,
				localSigner,
			);

			// handle auth url request
			let unlisten: UnlistenFn;
			let authWindow: Window;
			let account: string = undefined;

			remoteSigner.addListener("authUrl", async (authUrl: string) => {
				authWindow = new Window(`auth-${serviceId}`, {
					url: authUrl,
					title: domain,
					titleBarStyle: "overlay",
					width: 600,
					height: 650,
					center: true,
					closable: false,
				});
				unlisten = await authWindow.onCloseRequested(() => {
					if (!account) {
						setIsLoading(false);
						unlisten();

						return authWindow.close();
					}
				});
			});

			// create new account
			account = await remoteSigner.createAccount(
				data.username,
				domain,
				data.email,
			);

			if (!account) {
				unlisten();
				setIsLoading(false);

				authWindow.close();

				return toast.error("Failed to create new account, try again later");
			}

			unlisten();
			authWindow.close();

			// add account to storage
			await storage.createSetting("nsecbunker", "1");
			const dbAccount = await storage.createAccount({
				pubkey: account,
				privkey: localSigner.privateKey,
			});
			ark.account = dbAccount;

			// get final signer with newly created account
			const finalSigner = new NDKNip46Signer(bunker, account, localSigner);
			await finalSigner.blockUntilReady();

			// update main ndk instance signer
			ark.updateNostrSigner({ signer: finalSigner });

			// remove default nsecbunker profile and contact list
			// await ark.createEvent({ kind: NDKKind.Metadata, content: "", tags: [] });
			await ark.createEvent({ kind: NDKKind.Contacts, content: "", tags: [] });

			setIsLoading(false);
			setOnboarding({ open: true, newUser: true });

			return navigate("/auth/onboarding", { replace: true });
		} catch (e) {
			setIsLoading(false);
			toast.error(String(e));
		}
	};

	return (
		<div className="relative flex items-center justify-center w-full h-full">
			<div className="flex flex-col w-full max-w-md gap-8 mx-auto">
				<div className="flex flex-col gap-1 text-center items-center">
					<h1 className="text-2xl font-semibold">
						Let's get you set up on Nostr.
					</h1>
					<p className="text-lg font-medium leading-snug text-neutral-600 dark:text-neutral-500">
						Get started with familiar way, but all data belong to you and you
						have ability controls everything.
					</p>
				</div>
				{!services ? (
					<div className="flex items-center justify-center w-full">
						<LoaderIcon className="size-5 animate-spin" />
					</div>
				) : (
					<div className="flex flex-col gap-6">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-3 mb-0"
						>
							<div className="flex flex-col gap-6 p-5 bg-neutral-950 rounded-2xl">
								<div className="flex flex-col gap-2">
									<label
										htmlFor="username"
										className="text-sm font-semibold uppercase text-neutral-600"
									>
										Username *
									</label>
									<div className="flex items-center justify-between w-full gap-2 bg-neutral-900 rounded-xl">
										<input
											type={"text"}
											{...register("username", {
												required: true,
												minLength: 1,
											})}
											spellCheck={false}
											autoComplete="off"
											autoCorrect="off"
											autoCapitalize="off"
											placeholder="lume"
											className="flex-1 min-w-0 text-xl bg-transparent border-transparent outline-none focus:outline-none focus:ring-0 focus:border-none h-14 ring-0 placeholder:text-neutral-600"
										/>
										<Select.Root value={serviceId} onValueChange={setServiceId}>
											<Select.Trigger className="inline-flex items-center justify-end gap-2 pr-3 text-xl font-semibold text-blue-500 w-max shrink-0">
												<Select.Value>@{getDomainName(serviceId)}</Select.Value>
												<Select.Icon>
													<ChevronDownIcon className="size-5" />
												</Select.Icon>
											</Select.Trigger>
											<Select.Portal>
												<Select.Content className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl">
													<Select.Viewport className="p-3">
														<Select.Group>
															<Select.Label className="mb-2 text-sm font-medium uppercase px-7 text-neutral-600">
																Public handles
															</Select.Label>
															{services.map((service) => (
																<Item key={service.id} event={service} />
															))}
														</Select.Group>
													</Select.Viewport>
												</Select.Content>
											</Select.Portal>
										</Select.Root>
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<label
										htmlFor="email"
										className="text-sm font-semibold uppercase text-neutral-600"
									>
										Backup Email (Optional)
									</label>
									<input
										type={"email"}
										{...register("email", { required: false })}
										spellCheck={false}
										autoCapitalize="none"
										autoCorrect="none"
										className="px-3 text-xl border-transparent rounded-xl h-14 bg-neutral-900 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-800"
									/>
								</div>
							</div>
							<div>
								<button
									type="submit"
									disabled={!isValid}
									className="inline-flex items-center justify-center w-full text-lg h-12 font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-50"
								>
									{loading ? (
										<LoaderIcon className="size-5 animate-spin" />
									) : (
										"Create Account"
									)}
								</button>
							</div>
						</form>
						<div className="flex flex-col gap-6">
							<div className="flex flex-col">
								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-neutral-900" />
									</div>
									<div className="relative flex justify-center">
										<span className="px-2 font-medium bg-black text-neutral-500">
											Or
										</span>
									</div>
								</div>
								<span className="mx-auto text-xs font-medium bg-black text-neutral-600">
									More compatible with other Nostr clients
								</span>
							</div>
							<div>
								<button
									type="button"
									onClick={generateNostrKeys}
									className="mb-2 inline-flex items-center justify-center w-full h-12 text-lg font-medium text-neutral-50 rounded-xl bg-neutral-950 hover:bg-neutral-900"
								>
									Generate Nostr Keys
								</button>
								<p className="text-sm text-center text-neutral-500">
									If you are using this option, please make sure keep your keys
									in safe place. You{" "}
									<span className="text-red-600">cannot recover</span> if it
									lost, all your data will be{" "}
									<span className="text-red-600">lost forever.</span>
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
