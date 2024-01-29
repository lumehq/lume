import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
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
						if (!ark.account) return redirect("auth");
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
					],
				},
				{
					path: "settings",
					element: <SettingsLayout />,
					children: [
						{
							index: true,
							async lazy() {
								const { GeneralSettingScreen } = await import(
									"./routes/settings/general"
								);
								return { Component: GeneralSettingScreen };
							},
						},
						{
							path: "profile",
							async lazy() {
								const { ProfileSettingScreen } = await import(
									"./routes/settings/profile"
								);
								return { Component: ProfileSettingScreen };
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
							path: "nwc",
							async lazy() {
								const { NWCScreen } = await import("./routes/settings/nwc");
								return { Component: NWCScreen };
							},
						},
						{
							path: "about",
							async lazy() {
								const { AboutScreen } = await import("./routes/settings/about");
								return { Component: AboutScreen };
							},
						},
					],
				},
				{
					path: "activity",
					async lazy() {
						const { ActivityScreen } = await import("./routes/activty");
						return { Component: ActivityScreen };
					},
					children: [
						{
							path: ":id",
							async lazy() {
								const { ActivityIdScreen } = await import(
									"./routes/activty/id"
								);
								return { Component: ActivityIdScreen };
							},
						},
					],
				},
				{
					path: "relays",
					async lazy() {
						const { RelaysScreen } = await import("./routes/relays");
						return { Component: RelaysScreen };
					},
					children: [
						{
							index: true,
							async lazy() {
								const { RelayGlobalScreen } = await import(
									"./routes/relays/global"
								);
								return { Component: RelayGlobalScreen };
							},
						},
						{
							path: "follows",
							async lazy() {
								const { RelayFollowsScreen } = await import(
									"./routes/relays/follows"
								);
								return { Component: RelayFollowsScreen };
							},
						},
						{
							path: ":url",
							loader: async ({ request, params }) => {
								return defer({
									relay: fetch(`https://${params.url}`, {
										method: "GET",
										headers: {
											Accept: "application/nostr+json",
										},
										signal: request.signal,
									}).then((res) => res.json()),
								});
							},
							async lazy() {
								const { RelayUrlScreen } = await import("./routes/relays/url");
								return { Component: RelayUrlScreen };
							},
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
					async lazy() {
						const { CreateAccountScreen } = await import(
							"./routes/auth/create"
						);
						return { Component: CreateAccountScreen };
					},
				},
				{
					path: "create-keys",
					async lazy() {
						const { CreateAccountKeys } = await import(
							"./routes/auth/create-keys"
						);
						return { Component: CreateAccountKeys };
					},
				},
				{
					path: "create-address",
					loader: async () => {
						return await ark.getOAuthServices();
					},
					async lazy() {
						const { CreateAccountAddress } = await import(
							"./routes/auth/create-address"
						);
						return { Component: CreateAccountAddress };
					},
				},
				{
					path: "login",
					async lazy() {
						const { LoginScreen } = await import("./routes/auth/login");
						return { Component: LoginScreen };
					},
				},
				{
					path: "login-key",
					async lazy() {
						const { LoginWithKey } = await import("./routes/auth/login-key");
						return { Component: LoginWithKey };
					},
				},
				{
					path: "login-nsecbunker",
					async lazy() {
						const { LoginWithNsecbunker } = await import(
							"./routes/auth/login-nsecbunker"
						);
						return { Component: LoginWithNsecbunker };
					},
				},
				{
					path: "login-oauth",
					async lazy() {
						const { LoginWithOAuth } = await import(
							"./routes/auth/login-oauth"
						);
						return { Component: LoginWithOAuth };
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
