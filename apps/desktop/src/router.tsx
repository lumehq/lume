import { useArk, useStorage } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { AppLayout, AuthLayout, HomeLayout, SettingsLayout } from "@lume/ui";
import { fetch } from "@tauri-apps/plugin-http";
import {
	RouterProvider,
	createBrowserRouter,
	defer,
	redirect,
} from "react-router-dom";
import { ErrorScreen } from "./routes/error";

export default function Router() {
	const ark = useArk();
	const storage = useStorage();

	const router = createBrowserRouter([
		{
			element: <AppLayout platform={storage.platform} />,
			children: [
				{
					path: "/",
					element: <HomeLayout />,
					errorElement: <ErrorScreen />,
					loader: async () => {
						if (!storage.account) return redirect("auth");
						return null;
					},
					children: [
						{
							index: true,
							async lazy() {
								const { HomeScreen } = await import("./routes/home");
								return { Component: HomeScreen };
							},
						},
						{
							path: "nwc",
							async lazy() {
								const { NWCScreen } = await import("./routes/nwc");
								return { Component: NWCScreen };
							},
						},
						{
							path: "relays",
							async lazy() {
								const { RelaysScreen } = await import("./routes/relays");
								return { Component: RelaysScreen };
							},
						},
						{
							path: "relays/:url",
							loader: async ({ params }) => {
								return defer({
									relay: fetch(`https://${params.url}`, {
										method: "GET",
										headers: {
											Accept: "application/nostr+json",
										},
									}).then((res) => res.json()),
								});
							},
							async lazy() {
								const { RelayScreen } = await import("./routes/relays/relay");
								return { Component: RelayScreen };
							},
						},
						{
							path: "settings",
							element: <SettingsLayout />,
							children: [
								{
									index: true,
									async lazy() {
										const { UserSettingScreen } = await import(
											"./routes/settings"
										);
										return { Component: UserSettingScreen };
									},
								},
								{
									path: "edit-profile",
									async lazy() {
										const { EditProfileScreen } = await import(
											"./routes/settings/editProfile"
										);
										return { Component: EditProfileScreen };
									},
								},
								{
									path: "edit-contact",
									async lazy() {
										const { EditContactScreen } = await import(
											"./routes/settings/editContact"
										);
										return { Component: EditContactScreen };
									},
								},
								{
									path: "general",
									async lazy() {
										const { GeneralSettingScreen } = await import(
											"./routes/settings/general"
										);
										return { Component: GeneralSettingScreen };
									},
								},
								{
									path: "backup",
									async lazy() {
										const { BackupSettingScreen } = await import(
											"./routes/settings/backup"
										);
										return { Component: BackupSettingScreen };
									},
								},
								{
									path: "advanced",
									async lazy() {
										const { AdvancedSettingScreen } = await import(
											"./routes/settings/advanced"
										);
										return { Component: AdvancedSettingScreen };
									},
								},
								{
									path: "about",
									async lazy() {
										const { AboutScreen } = await import(
											"./routes/settings/about"
										);
										return { Component: AboutScreen };
									},
								},
							],
						},
					],
				},
				{
					path: "depot",
					children: [
						{
							index: true,
							loader: () => {
								const depot = storage.checkDepot();
								if (!depot) return redirect("/depot/onboarding/");
								return null;
							},
							async lazy() {
								const { DepotScreen } = await import("./routes/depot");
								return { Component: DepotScreen };
							},
						},
						{
							path: "onboarding",
							async lazy() {
								const { DepotOnboardingScreen } = await import(
									"./routes/depot/onboarding"
								);
								return { Component: DepotOnboardingScreen };
							},
						},
					],
				},
			],
		},
		{
			path: "auth",
			element: <AuthLayout platform={storage.platform} />,
			errorElement: <ErrorScreen />,
			children: [
				{
					index: true,
					async lazy() {
						const { WelcomeScreen } = await import("./routes/auth/welcome");
						return { Component: WelcomeScreen };
					},
				},
				{
					path: "create",
					loader: async () => {
						return await ark.getOAuthServices();
					},
					async lazy() {
						const { CreateAccountScreen } = await import(
							"./routes/auth/create"
						);
						return { Component: CreateAccountScreen };
					},
				},
				{
					path: "import",
					async lazy() {
						const { ImportAccountScreen } = await import(
							"./routes/auth/import"
						);
						return { Component: ImportAccountScreen };
					},
				},
				{
					path: "onboarding",
					async lazy() {
						const { OnboardingScreen } = await import(
							"./routes/auth/onboarding"
						);
						return { Component: OnboardingScreen };
					},
				},
				{
					path: "tutorials/note",
					async lazy() {
						const { TutorialNoteScreen } = await import(
							"./routes/auth/tutorials/note"
						);
						return { Component: TutorialNoteScreen };
					},
				},
				{
					path: "tutorials/widget",
					async lazy() {
						const { TutorialWidgetScreen } = await import(
							"./routes/auth/tutorials/widget"
						);
						return { Component: TutorialWidgetScreen };
					},
				},
				{
					path: "tutorials/posting",
					async lazy() {
						const { TutorialPostingScreen } = await import(
							"./routes/auth/tutorials/posting"
						);
						return { Component: TutorialPostingScreen };
					},
				},
				{
					path: "tutorials/finish",
					async lazy() {
						const { TutorialFinishScreen } = await import(
							"./routes/auth/tutorials/finish"
						);
						return { Component: TutorialFinishScreen };
					},
				},
			],
		},
	]);

	return (
		<RouterProvider
			router={router}
			fallbackElement={
				<div className="flex items-center justify-center w-full h-full">
					<LoaderIcon className="w-6 h-6 animate-spin" />
				</div>
			}
			future={{ v7_startTransition: true }}
		/>
	);
}
