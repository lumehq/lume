import { SVGProps } from "react";

export function BellFilledIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M3.822 9.526a8.207 8.207 0 0116.358 0l.355 4.262c.03.374.15.735.32 1.246a2.587 2.587 0 01-2.17 3.387c-.957.106-1.916.19-2.876.25a3.843 3.843 0 01-7.616 0c-.96-.06-1.92-.143-2.877-.25a2.588 2.588 0 01-2.17-3.39c.17-.51.29-.872.32-1.245l.356-4.26zm6.44 9.24a1.843 1.843 0 003.478 0l-.294.008a60.587 60.587 0 01-3.184-.008z"
				clipRule="evenodd"
			/>
		</svg>
	);
}
