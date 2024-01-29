import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { locale } from "@tauri-apps/plugin-os";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const enFilePath = await resolveResource("locales/en.json");
const jaFilePath = await resolveResource("locales/ja.json");

const enLocale = JSON.parse(await readTextFile(enFilePath));
const jaLocale = JSON.parse(await readTextFile(jaFilePath));

const osLocale = (await locale()).slice(0, 2);

const resources = {
	en: {
		translation: enLocale,
	},
	ja: {
		translation: jaLocale,
	},
};

i18n.use(initReactI18next).init({
	lng: osLocale,
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	resources,
});

export default i18n;
