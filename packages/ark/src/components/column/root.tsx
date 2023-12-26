import { Resizable } from "re-resizable";
import { ReactNode, useState } from "react";
import { MemoryRouter, UNSAFE_LocationContext } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export function ColumnRoot({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const [width, setWidth] = useState(420);

	return (
		<UNSAFE_LocationContext.Provider value={null}>
			<Resizable
				size={{ width, height: "100%" }}
				onResizeStart={(e) => e.preventDefault()}
				onResizeStop={(_e, _direction, _ref, d) => {
					setWidth((prevWidth) => prevWidth + d.width);
				}}
				minWidth={420}
				maxWidth={600}
				className={twMerge(
					"relative flex flex-col border-r-2 border-neutral-50 hover:border-neutral-100 dark:border-neutral-950 dark:hover:border-neutral-900",
					className,
				)}
				enable={{ right: true }}
			>
				<MemoryRouter future={{ v7_startTransition: true }}>
					{children}
				</MemoryRouter>
			</Resizable>
		</UNSAFE_LocationContext.Provider>
	);
}
