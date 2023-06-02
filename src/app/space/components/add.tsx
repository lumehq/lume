import { AddFeedBlock } from "@app/space/components/addFeed";
import { AddImageBlock } from "@app/space/components/addImage";
import { Menu, Transition } from "@headlessui/react";
import { FeedIcon, ImageIcon, PlusIcon } from "@shared/icons";
import { Fragment, useState } from "react";

export function AddBlock() {
	const [imageModal, setImageModal] = useState(false);
	const [feedModal, setFeedModal] = useState(false);

	const openAddImageModal = () => {
		setImageModal(true);
	};

	const openAddFeedModal = () => {
		setFeedModal(true);
	};

	return (
		<>
			<Menu as="div" className="relative inline-block text-left">
				<Menu.Button className="group inline-flex flex-col items-center gap-2.5">
					<div className="inline-flex h-9 w-9 shrink items-center justify-center rounded-lg bg-zinc-900 group-hover:bg-zinc-800">
						<PlusIcon width={16} height={16} className="text-zinc-500" />
					</div>
				</Menu.Button>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute mt-2 right-1/2 transform translate-x-1/2 w-56 origin-top-right rounded-md bg-zinc-900 ring-1 ring-zinc-800 focus:outline-none">
						<div className="px-1 py-1">
							<Menu.Item>
								<button
									type="button"
									onClick={() => openAddImageModal()}
									className="group flex w-full items-center rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 px-2 py-2 text-sm"
								>
									<ImageIcon width={15} height={15} className="mr-2" />
									Add image
								</button>
							</Menu.Item>
							<Menu.Item>
								<button
									type="button"
									onClick={() => openAddFeedModal()}
									className="group flex w-full items-center rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 px-2 py-2 text-sm"
								>
									<FeedIcon width={15} height={15} className="mr-2" />
									Add feed
								</button>
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>

			{imageModal && <AddImageBlock parentState={setImageModal} />}
			{feedModal && <AddFeedBlock parentState={setFeedModal} />}
		</>
	);
}
