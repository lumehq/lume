import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";

type MutableRefObject<T> = {
	current: T;
};

const useEffectInEvent = <K extends keyof WindowEventMap>(
	event: K,
	set: () => void,
	useCapture?: boolean,
) => {
	useEffect(() => {
		if (set) {
			set();
			window.addEventListener(event, set, useCapture);

			return () => window.removeEventListener(event, set, useCapture);
		}
	}, []);
};

const useTauriInEvent = (set: () => void) => {
	useEffect(() => {
		if (set) {
			const unlisten = listen("scrolling", () => {
				set();
			});

			return () => {
				unlisten.then((f) => f());
			};
		}
	}, []);
};

export const useRect = <T extends HTMLDivElement | null>(): [
	DOMRect | undefined,
	MutableRefObject<T | null>,
] => {
	const ref = useRef<T>(null);
	const [rect, setRect] = useState<DOMRect>();

	const set = (): void => {
		setRect(ref.current?.getBoundingClientRect());
	};

	useTauriInEvent(set);
	useEffectInEvent("resize", set);
	useEffectInEvent("scroll", set, true);

	return [rect, ref];
};
