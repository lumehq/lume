import { Column } from "@lume/ark";
import { ColumnIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { TOPICS } from "@lume/utils";

export function Default({ column }: { column: IColumn }) {
	return (
		<Column.Root>
			<Column.Header
				id={column.id}
				title="Add columns"
				icon={<ColumnIcon className="size-4" />}
			/>
			<div className="h-full px-3 mt-3 overflow-y-auto scrollbar-none">
				<div className="flex flex-col gap-5">
					<div>
						<h1 className="text-lg font-semibold leading-tight">Topics</h1>
						<p className="text-neutral-600 dark:text-neutral-400">
							Discover content based on your interests.
						</p>
					</div>
					<div className="grid grid-cols-2 gap-3">
						{TOPICS.sort((a, b) => a.title.localeCompare(b.title)).map(
							(topic, index) => (
								<div
									key={topic + index.toString()}
									className="flex flex-col w-full px-3 rounded-lg bg-neutral-100"
								>
									<div className="rounded-md h-9 w-9 shrink-0">
										<img
											src={`/${topic.title.toLowerCase()}.jpg`}
											alt={topic.title}
											className="rounded-md h-9 w-9"
										/>
									</div>
									<p className="font-medium">{topic.title}</p>
								</div>
							),
						)}
					</div>
				</div>
			</div>
		</Column.Root>
	);
}
