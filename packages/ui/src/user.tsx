import { useProfile } from "@lume/ark";
import { RepostIcon } from "@lume/icons";
import { displayNpub, formatCreatedAt } from "@lume/utils";
import * as Avatar from "@radix-ui/react-avatar";
import { minidenticon } from "minidenticons";
import { memo, useMemo } from "react";

export const User = memo(function User({
	pubkey,
	time,
	variant = "default",
	subtext,
}: {
	pubkey: string;
	time?: number;
	variant?:
		| "default"
		| "simple"
		| "mention"
		| "notify"
		| "notify2"
		| "repost"
		| "chat"
		| "large"
		| "thread"
		| "miniavatar"
		| "avatar"
		| "stacked"
		| "ministacked"
		| "childnote";
	subtext?: string;
}) {
	const { isLoading, user } = useProfile(pubkey);

	const createdAt = useMemo(
		() => formatCreatedAt(time, variant === "chat"),
		[time, variant],
	);
	const fallbackName = useMemo(() => displayNpub(pubkey, 16), [pubkey]);
	const fallbackAvatar = useMemo(
		() =>
			`data:image/svg+xml;utf8,${encodeURIComponent(
				minidenticon(pubkey, 90, 50),
			)}`,
		[pubkey],
	);

	if (variant === "mention") {
		if (isLoading) {
			return (
				<div className="flex items-center gap-2">
					<Avatar.Root className="shrink-0">
						<Avatar.Image
							src={fallbackAvatar}
							alt={pubkey}
							className="w-6 h-6 bg-black rounded-md dark:bg-white"
						/>
					</Avatar.Root>
					<div className="flex items-baseline flex-1 gap-2">
						<h5 className="max-w-[10rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
							{fallbackName}
						</h5>
						<span className="text-neutral-600 dark:text-neutral-400">·</span>
						<span className="text-neutral-600 dark:text-neutral-400">
							{createdAt}
						</span>
					</div>
				</div>
			);
		}

		return (
			<div className="flex items-center h-6 gap-2">
				<Avatar.Root className="shrink-0">
					<Avatar.Image
						src={user?.picture || user?.image}
						alt={pubkey}
						loading="lazy"
						decoding="async"
						className="w-6 h-6 rounded-md"
					/>
					<Avatar.Fallback delayMs={300}>
						<img
							src={fallbackAvatar}
							alt={pubkey}
							className="w-6 h-6 bg-black rounded-md dark:bg-white"
						/>
					</Avatar.Fallback>
				</Avatar.Root>
				<div className="flex items-baseline flex-1 gap-2">
					<h5 className="max-w-[10rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
						{user?.name ||
							user?.display_name ||
							user?.displayName ||
							fallbackName}
					</h5>
					<span className="text-neutral-600 dark:text-neutral-400">·</span>
					<span className="text-neutral-600 dark:text-neutral-400">
						{createdAt}
					</span>
				</div>
			</div>
		);
	}

	if (variant === "notify2") {
		if (isLoading) {
			return (
				<div className="flex items-center gap-2">
					<Avatar.Root className="w-8 h-8 shrink-0">
						<Avatar.Image
							src={fallbackAvatar}
							alt={pubkey}
							className="w-8 h-8 bg-black rounded-md dark:bg-white"
						/>
					</Avatar.Root>
					<h5 className="max-w-[10rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
						{fallbackName}
					</h5>
				</div>
			);
		}

		return (
			<div className="flex items-center gap-2">
				<Avatar.Root className="w-8 h-8 shrink-0">
					<Avatar.Image
						src={user?.picture || user?.image}
						alt={pubkey}
						loading="eager"
						decoding="async"
						className="w-8 h-8 rounded-md"
					/>
					<Avatar.Fallback delayMs={300}>
						<img
							src={fallbackAvatar}
							alt={pubkey}
							className="w-8 h-8 bg-black rounded-md dark:bg-white"
						/>
					</Avatar.Fallback>
				</Avatar.Root>
				<div className="inline-flex items-center gap-1">
					<h5 className="max-w-[8rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
						{user?.name ||
							user?.display_name ||
							user?.displayName ||
							fallbackName}
					</h5>
					<p>{subtext}</p>
				</div>
			</div>
		);
	}

	if (variant === "notify") {
		if (isLoading) {
			return (
				<div className="flex items-center gap-2">
					<Avatar.Root className="w-8 h-8 shrink-0">
						<Avatar.Image
							src={fallbackAvatar}
							alt={pubkey}
							className="w-8 h-8 bg-black rounded-md dark:bg-white"
						/>
					</Avatar.Root>
					<h5 className="max-w-[10rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
						{fallbackName}
					</h5>
				</div>
			);
		}

		return (
			<div className="flex items-center gap-2">
				<Avatar.Root className="w-8 h-8 shrink-0">
					<Avatar.Image
						src={user?.picture || user?.image}
						alt={pubkey}
						loading="eager"
						decoding="async"
						className="w-8 h-8 rounded-md"
					/>
					<Avatar.Fallback delayMs={300}>
						<img
							src={fallbackAvatar}
							alt={pubkey}
							className="w-8 h-8 bg-black rounded-md dark:bg-white"
						/>
					</Avatar.Fallback>
				</Avatar.Root>
				<h5 className="max-w-[10rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
					{user?.name || user?.display_name || fallbackName}
				</h5>
			</div>
		);
	}

	if (variant === "large") {
		if (isLoading) {
			return (
				<div className="flex items-center gap-2.5">
					<div className="rounded-lg h-14 w-14 shrink-0 animate-pulse bg-neutral-300 dark:bg-neutral-700" />
					<div className="flex flex-col gap-1.5">
						<div className="h-3.5 w-36 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
						<div className="w-24 h-4 rounded animate-pulse bg-neutral-300 dark:bg-neutral-700" />
					</div>
				</div>
			);
		}

		return (
			<div>
				<div className="h-20 bg-gray-200 rounded-t-lg dark:bg-gray-800">
					{user?.banner ? (
						<img
							src={user.banner}
							alt="banner"
							className="object-cover w-full h-full"
						/>
					) : null}
				</div>
				<div className="flex h-full w-full flex-col gap-2.5 px-3 -mt-6">
					<Avatar.Root className="shrink-0">
						<Avatar.Image
							src={user?.picture}
							alt={pubkey}
							decoding="async"
							className="object-cover rounded-lg size-11"
						/>
						<Avatar.Fallback delayMs={300}>
							<img
								src={fallbackAvatar}
								alt={pubkey}
								className="bg-black rounded-lg size-11 dark:bg-white"
							/>
						</Avatar.Fallback>
					</Avatar.Root>
					<div className="flex flex-col items-start text-start">
						<p className="max-w-[15rem] truncate text-lg font-semibold leadning-tight">
							{user?.name || user?.display_name}
						</p>
						<p className="whitespace-pre-line select-text break-p text-neutral-700 dark:text-neutral-600 max-w-none">
							{user?.about || "No bio"}
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (variant === "simple") {
		if (isLoading) {
			return (
				<div className="flex items-center gap-2.5">
					<div className="w-10 h-10 rounded-lg shrink-0 animate-pulse bg-neutral-300 dark:bg-neutral-700" />
					<div className="flex flex-col items-start w-full gap-1">
						<div className="h-4 rounded w-36 animate-pulse bg-neutral-300 dark:bg-neutral-700" />
						<div className="w-24 h-4 rounded animate-pulse bg-neutral-300 dark:bg-neutral-700" />
					</div>
				</div>
			);
		}

		return (
			<div className="flex items-center gap-2.5">
				<Avatar.Root className="w-10 h-10 shrink-0">
					<Avatar.Image
						src={user?.picture || user?.image}
						alt={pubkey}
						loading="lazy"
						decoding="async"
						className="object-cover w-10 h-10 rounded-lg"
					/>
					<Avatar.Fallback delayMs={300}>
						<img
							src={fallbackAvatar}
							alt={pubkey}
							className="w-10 h-10 bg-black rounded-lg dark:bg-white"
						/>
					</Avatar.Fallback>
				</Avatar.Root>
				<div className="flex flex-col items-start w-full">
					<h3 className="max-w-[15rem] truncate text-base font-semibold text-neutral-900 dark:text-neutral-100">
						{user?.name || user?.display_name || user?.displayName}
					</h3>
					<p className="max-w-[10rem] truncate text-sm text-neutral-900 dark:text-neutral-100/70">
						{user?.nip05 || user?.username || fallbackName}
					</p>
				</div>
			</div>
		);
	}

	if (variant === "avatar") {
		if (isLoading) {
			return (
				<div className="w-12 h-12 rounded-lg animate-pulse bg-neutral-300 dark:bg-neutral-700" />
			);
		}

		return (
			<Avatar.Root>
				<Avatar.Image
					src={user?.picture || user?.image}
					alt={pubkey}
					loading="lazy"
					decoding="async"
					className="w-12 h-12 rounded-lg"
				/>
				<Avatar.Fallback delayMs={300}>
					<img
						src={fallbackAvatar}
						alt={pubkey}
						className="w-12 h-12 bg-black rounded-lg dark:bg-white"
					/>
				</Avatar.Fallback>
			</Avatar.Root>
		);
	}

	if (variant === "miniavatar") {
		if (isLoading) {
			return (
				<div className="w-10 h-10 rounded-lg shrink-0 animate-pulse bg-neutral-300 dark:bg-neutral-700" />
			);
		}

		return (
			<Avatar.Root className="w-10 h-10 shrink-0">
				<Avatar.Image
					src={user?.picture || user?.image}
					alt={pubkey}
					loading="lazy"
					decoding="async"
					className="w-10 h-10 rounded-lg"
				/>
				<Avatar.Fallback delayMs={300}>
					<img
						src={fallbackAvatar}
						alt={pubkey}
						className="w-10 h-10 bg-black rounded-lg dark:bg-white"
					/>
				</Avatar.Fallback>
			</Avatar.Root>
		);
	}

	if (variant === "childnote") {
		if (isLoading) {
			return (
				<>
					<Avatar.Root className="w-10 h-10 shrink-0">
						<Avatar.Image
							src={fallbackAvatar}
							alt={pubkey}
							className="object-cover w-10 h-10 bg-black rounded-lg dark:bg-white"
						/>
					</Avatar.Root>
					<div className="absolute left-2 top-2 inline-flex items-center gap-1.5 font-semibold leading-tight">
						<div className="w-full max-w-[10rem] truncate">{fallbackName} </div>
						<div className="font-normal text-neutral-700 dark:text-neutral-300">
							{subtext}:
						</div>
					</div>
				</>
			);
		}

		return (
			<>
				<Avatar.Root className="w-10 h-10 shrink-0">
					<Avatar.Image
						src={user?.picture || user?.image}
						alt={pubkey}
						loading="lazy"
						decoding="async"
						className="object-cover w-10 h-10 rounded-lg"
					/>
					<Avatar.Fallback delayMs={300}>
						<img
							src={fallbackAvatar}
							alt={pubkey}
							className="w-10 h-10 bg-black rounded-lg dark:bg-white"
						/>
					</Avatar.Fallback>
				</Avatar.Root>
				<div className="absolute left-2 top-2 inline-flex items-center gap-1.5 font-semibold leading-tight">
					<div className="w-full max-w-[10rem] truncate">
						{user?.display_name ||
							user?.name ||
							user?.displayName ||
							fallbackName}{" "}
					</div>
					<div className="font-normal text-neutral-700 dark:text-neutral-300">
						{subtext}:
					</div>
				</div>
			</>
		);
	}

	if (variant === "stacked") {
		if (isLoading) {
			return (
				<div className="inline-block w-8 h-8 rounded-full animate-pulse bg-neutral-300 ring-1 ring-neutral-200 dark:bg-neutral-700 dark:ring-neutral-800" />
			);
		}

		return (
			<Avatar.Root>
				<Avatar.Image
					src={user?.picture || user?.image}
					alt={pubkey}
					loading="lazy"
					decoding="async"
					className="inline-block w-8 h-8 rounded-full ring-1 ring-neutral-200 dark:ring-neutral-800"
				/>
				<Avatar.Fallback delayMs={300}>
					<img
						src={fallbackAvatar}
						alt={pubkey}
						className="inline-block w-8 h-8 bg-black rounded-full ring-1 ring-neutral-200 dark:bg-white dark:ring-neutral-800"
					/>
				</Avatar.Fallback>
			</Avatar.Root>
		);
	}

	if (variant === "ministacked") {
		if (isLoading) {
			return (
				<div className="inline-block w-6 h-6 rounded-full animate-pulse bg-neutral-300 ring-1 ring-white dark:ring-black" />
			);
		}

		return (
			<Avatar.Root>
				<Avatar.Image
					src={user?.picture || user?.image}
					alt={pubkey}
					loading="lazy"
					decoding="async"
					className="inline-block w-6 h-6 rounded-full ring-1 ring-white dark:ring-black"
				/>
				<Avatar.Fallback delayMs={300}>
					<img
						src={fallbackAvatar}
						alt={pubkey}
						className="inline-block w-6 h-6 bg-black rounded-full ring-1 ring-white dark:bg-white dark:ring-black"
					/>
				</Avatar.Fallback>
			</Avatar.Root>
		);
	}

	if (variant === "repost") {
		if (isLoading) {
			return (
				<div className="flex gap-3">
					<div className="inline-flex items-center justify-center w-10 h-10">
						<RepostIcon className="w-5 h-5 text-blue-500" />
					</div>
					<div className="inline-flex items-center gap-2">
						<div className="w-6 h-6 rounded animate-pulse bg-neutral-300 dark:bg-neutral-700" />
						<div className="w-24 h-4 rounded animate-pulse bg-neutral-300 dark:bg-neutral-700" />
					</div>
				</div>
			);
		}

		return (
			<div className="flex gap-2 px-3">
				<div className="inline-flex items-center justify-center w-10">
					<RepostIcon className="w-5 h-5 text-blue-500" />
				</div>
				<div className="inline-flex items-center gap-2">
					<Avatar.Root className="shrink-0">
						<Avatar.Image
							src={user?.picture || user?.image}
							alt={pubkey}
							loading="lazy"
							decoding="async"
							className="object-cover w-6 h-6 rounded"
						/>
						<Avatar.Fallback delayMs={300}>
							<img
								src={fallbackAvatar}
								alt={pubkey}
								className="w-6 h-6 bg-black rounded dark:bg-white"
							/>
						</Avatar.Fallback>
					</Avatar.Root>
					<div className="inline-flex items-baseline gap-1">
						<h5 className="max-w-[10rem] truncate font-medium text-neutral-900 dark:text-neutral-100/80">
							{user?.name ||
								user?.display_name ||
								user?.displayName ||
								fallbackName}
						</h5>
						<span className="text-blue-500">reposted</span>
					</div>
				</div>
			</div>
		);
	}

	if (variant === "thread") {
		if (isLoading) {
			return (
				<div className="flex items-center h-16 gap-3 px-3">
					<div className="w-10 h-10 rounded-lg shrink-0 animate-pulse bg-neutral-300 dark:bg-neutral-700" />
					<div className="flex flex-col flex-1 gap-1">
						<div className="h-4 rounded w-36 animate-pulse bg-neutral-300 dark:bg-neutral-700" />
						<div className="w-24 h-3 rounded animate-pulse bg-neutral-300 dark:bg-neutral-700" />
					</div>
				</div>
			);
		}

		return (
			<div className="flex items-center h-16 gap-3 px-3">
				<Avatar.Root className="w-10 h-10 shrink-0">
					<Avatar.Image
						src={user?.picture || user?.image}
						alt={pubkey}
						loading="lazy"
						decoding="async"
						className="object-cover w-10 h-10 rounded-lg ring-1 ring-neutral-200/50 dark:ring-neutral-800/50"
					/>
					<Avatar.Fallback delayMs={300}>
						<img
							src={fallbackAvatar}
							alt={pubkey}
							className="w-10 h-10 bg-black rounded-lg ring-1 ring-neutral-200/50 dark:bg-white dark:ring-neutral-800/50"
						/>
					</Avatar.Fallback>
				</Avatar.Root>
				<div className="flex flex-col flex-1">
					<h5 className="max-w-[15rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
						{user?.name || user?.display_name || user?.displayName || "Anon"}
					</h5>
					<div className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
						<span>{createdAt}</span>
						<span>·</span>
						<span>{fallbackName}</span>
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center gap-3 px-3">
				<Avatar.Root className="h-9 w-9 shrink-0">
					<Avatar.Image
						src={fallbackAvatar}
						alt={pubkey}
						className="bg-black rounded-lg h-9 w-9 ring-1 ring-neutral-200/50 dark:bg-white dark:ring-neutral-800/50"
					/>
				</Avatar.Root>
				<div className="flex-1 h-6">
					<div className="max-w-[15rem] truncate font-semibold text-neutral-950 dark:text-neutral-50">
						{fallbackName}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-3 px-3">
			<Avatar.Root className="h-9 w-9 shrink-0">
				<Avatar.Image
					src={user?.picture || user?.image}
					alt={pubkey}
					loading="lazy"
					decoding="async"
					className="object-cover bg-white rounded-lg h-9 w-9 ring-1 ring-neutral-200/50 dark:ring-neutral-800/50"
				/>
				<Avatar.Fallback delayMs={300}>
					<img
						src={fallbackAvatar}
						alt={pubkey}
						className="bg-black rounded-lg h-9 w-9 ring-1 ring-neutral-200/50 dark:bg-white dark:ring-neutral-800/50"
					/>
				</Avatar.Fallback>
			</Avatar.Root>
			<div className="flex items-start flex-1 h-6 gap-2">
				<div className="max-w-[15rem] truncate font-semibold text-neutral-950 dark:text-neutral-50">
					{user?.name ||
						user?.display_name ||
						user?.displayName ||
						fallbackName}
				</div>
				<div className="inline-flex items-center gap-3 ml-auto">
					<div className="text-neutral-500 dark:text-neutral-400">
						{createdAt}
					</div>
				</div>
			</div>
		</div>
	);
});
