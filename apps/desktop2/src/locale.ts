import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import i18n from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

i18n
	.use(
		resourcesToBackend(async (language: string) => {
			const file_path = await resolveResource(`locales/${language}.json`);
			return JSON.parse(await readTextFile(file_path));
		}),
	)
	.use(initReactI18next)
	.init({
		lng: "en",
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
