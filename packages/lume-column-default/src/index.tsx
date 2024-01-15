import { Column, useColumnContext } from "@lume/ark";
import { ColumnIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { COL_TYPES } from "@lume/utils";

export function Default({ column }: { column: IColumn }) {
	const { addColumn } = useColumnContext();

	return (
		<Column.Root>
			<Column.Header
				id={column.id}
				title="Add columns"
				icon={<ColumnIcon className="size-4" />}
			/>
			<div className="h-full px-3 mt-3 flex flex-col gap-3 overflow-y-auto scrollbar-none">
				<div className="flex flex-col rounded-xl overflow-hidden">
					<div className="h-[100px] w-full">
						<img
							src="/columns/topic.jpg"
							srcSet="/columns/topic@2x.jpg 2x"
							alt="topic"
							className="w-full h-auto object-cover"
						/>
					</div>
					<div className="h-16 shrink-0 px-3 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
						<div>
							<h1 className="font-semibold">Topic</h1>
							<p className="max-w-[18rem] truncate text-sm text-neutral-500 dark:text-neutral-600">
								Explore all content based on your interest.
							</p>
						</div>
						<button
							type="button"
							onClick={() => {
								addColumn({ kind: COL_TYPES.topic, title: "", content: "" });
							}}
							className="shrink-0 w-16 h-8 rounded-lg text-sm font-semibold bg-neutral-100 dark:bg-neutral-900 text-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 inline-flex items-center justify-center"
						>
							Add
						</button>
					</div>
				</div>
				<div className="flex flex-col rounded-xl overflow-hidden">
					<div className="h-[100px] w-full">
						<img
							src="/columns/group.jpg"
							srcSet="/columns/group@2x.jpg 2x"
							alt="group"
							className="w-full h-auto object-cover"
						/>
					</div>
					<div className="h-16 shrink-0 px-3 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
						<div>
							<h1 className="font-semibold">Group Feeds</h1>
							<p className="max-w-[18rem] truncate text-sm text-neutral-500 dark:text-neutral-600">
								Collective of people you're interested in.
							</p>
						</div>
						<button
							type="button"
							onClick={() => {
								addColumn({ kind: COL_TYPES.group, title: "", content: "" });
							}}
							className="shrink-0 w-16 h-8 rounded-lg text-sm font-semibold bg-neutral-100 dark:bg-neutral-900 text-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 inline-flex items-center justify-center"
						>
							Add
						</button>
					</div>
				</div>
				<div className="flex flex-col rounded-xl overflow-hidden">
					<div className="h-[100px] w-full">
						<img
							src="/columns/antenas.jpg"
							srcSet="/columns/antenas@2x.jpg 2x"
							alt="antenas"
							className="w-full h-auto object-cover"
						/>
					</div>
					<div className="h-16 shrink-0 px-3 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
						<div>
							<h1 className="font-semibold">Antenas</h1>
							<p className="max-w-[18rem] truncate text-sm text-neutral-500 dark:text-neutral-600">
								Keep track to specific content.
							</p>
						</div>
						<button
							type="button"
							onClick={() => {
								addColumn({ kind: COL_TYPES.antenas, title: "", content: "" });
							}}
							className="shrink-0 w-16 h-8 rounded-lg text-sm font-semibold bg-neutral-100 dark:bg-neutral-900 text-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 inline-flex items-center justify-center"
						>
							Add
						</button>
					</div>
				</div>
			</div>
		</Column.Root>
	);
}
