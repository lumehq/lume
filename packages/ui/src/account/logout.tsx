import { useArk } from "@lume/ark";
import { LogoutIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Logout() {
	const ark = useArk();
	const storage = useStorage();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const logout = async () => {
		try {
			// logout
			await storage.logout();

			// clear cache
			queryClient.clear();
			ark.account = null;
			ark.ndk.signer = null;
			ark.ndk.activeUser = null;

			// redirect to welcome screen
			navigate("/auth/");
		} catch (e) {
			toast.error(String(e));
		}
	};

	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>
				<button
					type="button"
					className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
				>
					<LogoutIcon className="size-4" />
					Logout
				</button>
			</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-black/20" />
				<AlertDialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
					<div className="relative h-min w-full max-w-md rounded-xl bg-neutral-100 dark:bg-neutral-900">
						<div className="flex flex-col gap-1 border-b border-white/5 px-5 py-4">
							<AlertDialog.Title className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
								Are you sure!
							</AlertDialog.Title>
							<AlertDialog.Description className="text-sm leading-tight text-neutral-600 dark:text-neutral-400">
								You can always log back in at any time. If you just want to
								switch accounts, you can do that by adding an existing account.
							</AlertDialog.Description>
						</div>
						<div className="flex justify-end gap-2 px-5 py-3">
							<AlertDialog.Cancel asChild>
								<button
									type="button"
									className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-neutral-900 outline-none hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-800"
								>
									Cancel
								</button>
							</AlertDialog.Cancel>
							<AlertDialog.Action asChild>
								<button
									type="button"
									onClick={() => logout()}
									className="inline-flex h-9 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white outline-none hover:bg-red-600"
								>
									Logout
								</button>
							</AlertDialog.Action>
						</div>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
