import { Platform } from "@tauri-apps/plugin-os";
import { Store } from "@tauri-apps/plugin-store";

export class LumeStorage {
	#store: Store;
	readonly platform: Platform;
	readonly locale: string;
	public settings: {
		autoupdate: boolean;
		nsecbunker: boolean;
		media: boolean;
		hashtag: boolean;
		lowPower: boolean;
		translation: boolean;
		translateApiKey: string;
		instantZap: boolean;
		defaultZapAmount: number;
	};

	constructor(store: Store, platform: Platform, locale: string) {
		this.#store = store;
		this.locale = locale;
		this.platform = platform;
		this.settings = {
			autoupdate: false,
			nsecbunker: false,
			media: true,
			hashtag: true,
			lowPower: false,
			translation: false,
			translateApiKey: "",
			instantZap: false,
			defaultZapAmount: 21,
		};
	}

	public async createSetting(key: string, value: string | boolean) {
		this.settings[key] = value;
		await this.#store.set(this.settings[key], { value });
	}
}
