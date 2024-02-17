import { Settings } from "@lume/types";
import { Platform } from "@tauri-apps/plugin-os";
import { Store } from "@tauri-apps/plugin-store";

export class LumeStorage {
	#store: Store;
	readonly platform: Platform;
	readonly locale: string;
	public settings: Settings;

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
			nwc: "",
		};
	}

	public async init() {
		this.loadSettings();
	}

	public async loadSettings() {
		const data = await this.#store.get("settings");
		if (!data) return;

		const settings = JSON.parse(data as string) as Settings;

		if (Object.keys(settings).length) {
			for (const [key, value] of Object.entries(settings)) {
				this.settings[key] = value;
			}
		}
	}

	public async createSetting(key: string, value: string | number | boolean) {
		this.settings[key] = value;

		const settings: Settings = JSON.parse(await this.#store.get("settings"));
		const newSettings = { ...settings, key: value };

		await this.#store.set("settings", newSettings);
		await this.#store.save();
	}
}
