import { type Window, getCurrent } from "@tauri-apps/api/window";
import { type } from "@tauri-apps/plugin-os";
import React, { createContext, useCallback, useEffect, useState } from "react";

interface AppWindowContextType {
	appWindow: Window | null;
	isWindowMaximized: boolean;
	minimizeWindow: () => Promise<void>;
	maximizeWindow: () => Promise<void>;
	fullscreenWindow: () => Promise<void>;
	closeWindow: () => Promise<void>;
}

export const AppWindowContext = createContext<AppWindowContextType>({
	appWindow: null,
	isWindowMaximized: false,
	minimizeWindow: () => Promise.resolve(),
	maximizeWindow: () => Promise.resolve(),
	fullscreenWindow: () => Promise.resolve(),
	closeWindow: () => Promise.resolve(),
});

interface AppWindowProviderProps {
	children: React.ReactNode;
}

export const AppWindowProvider: React.FC<AppWindowProviderProps> = ({
	children,
}) => {
	const [appWindow, setAppWindow] = useState<Window | null>(null);
	const [isWindowMaximized, setIsWindowMaximized] = useState(false);

	useEffect(() => {
		const window = getCurrent();
		setAppWindow(window);
	}, []);

	const updateIsWindowMaximized = useCallback(async () => {
		if (appWindow) {
			const _isWindowMaximized = await appWindow.isMaximized();
			setIsWindowMaximized(_isWindowMaximized);
		}
	}, [appWindow]);

	useEffect(() => {
		let unlisten: () => void = () => {};

		async function getOsType() {
			const osname = await type();

			if (osname !== "macos") {
				updateIsWindowMaximized();

				const listen = async () => {
					if (appWindow) {
						unlisten = await appWindow.onResized(() => {
							updateIsWindowMaximized();
						});
					}
				};

				listen();
			}
		}

		getOsType();

		// Cleanup the listener when the component unmounts
		return () => unlisten?.();
	}, [appWindow, updateIsWindowMaximized]);

	const minimizeWindow = async () => {
		if (appWindow) {
			await appWindow.minimize();
		}
	};

	const maximizeWindow = async () => {
		if (appWindow) {
			await appWindow.toggleMaximize();
		}
	};

	const fullscreenWindow = async () => {
		if (appWindow) {
			const fullscreen = await appWindow.isFullscreen();
			if (fullscreen) {
				await appWindow.setFullscreen(false);
			} else {
				await appWindow.setFullscreen(true);
			}
		}
	};

	const closeWindow = async () => {
		if (appWindow) {
			await appWindow.close();
		}
	};

	return (
		<AppWindowContext.Provider
			value={{
				appWindow,
				isWindowMaximized,
				minimizeWindow,
				maximizeWindow,
				fullscreenWindow,
				closeWindow,
			}}
		>
			{children}
		</AppWindowContext.Provider>
	);
};
