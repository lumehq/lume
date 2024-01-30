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
import { Window } from "@tauri-apps/api/window";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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

export function CreateAccountAddress() {
	const ark = useArk();
	const storage = useStorage();
	const services = useLoaderData() as NDKEvent[];
	const setOnboarding = useSetAtom(onboardingAtom);
	const navigate = useNavigate();

	const [serviceId, setServiceId] = useState(services?.[0]?.id);
	const [loading, setIsLoading] = useState(false);

	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm();

	const getDomainName = (id: string) => {
		const event = services.find((ev) => ev.id === id);
		return JSON.parse(event.content).nip05.replace("_@", "") as string;
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
			const newAccount = await storage.createAccount({
				pubkey: account,
				privkey: localSigner.privateKey,
			});
			ark.account = newAccount;

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
						{t("signupWithProvider.title")}
					</h1>
				</div>
				{!services ? (
					<div className="flex items-center justify-center w-full">
						<LoaderIcon className="size-5 animate-spin" />
					</div>
				) : (
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
									{t("signupWithProvider.username")}
								</label>
								<div className="flex flex-col gap-1.5">
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
											placeholder="alice"
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
																{t("signupWithProvider.chooseProvider")}
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
									<span className="text-sm text-neutral-600">
										{t("signupWithProvider.usernameFooter")}
									</span>
								</div>
							</div>
							<div className="flex flex-col gap-1.5">
								<div className="flex flex-col gap-2">
									<label
										htmlFor="email"
										className="text-sm font-semibold uppercase text-neutral-600"
									>
										{t("signupWithProvider.email")}
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
								<span className="text-sm text-neutral-600">
									{t("signupWithProvider.emailFooter")}
								</span>
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
									t("global.continue")
								)}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
