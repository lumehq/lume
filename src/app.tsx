import "./index.css";
import { AuthCreateScreen } from "@app/auth/create";
import { CreateStep1Screen } from "@app/auth/create/step-1";
import { CreateStep2Screen } from "@app/auth/create/step-2";
import { CreateStep3Screen } from "@app/auth/create/step-3";
import { CreateStep4Screen } from "@app/auth/create/step-4";
import { AuthImportScreen } from "@app/auth/import";
import { ImportStep1Screen } from "@app/auth/import/step-1";
import { ImportStep2Screen } from "@app/auth/import/step-2";
import { OnboardingScreen } from "@app/auth/onboarding";
import { WelcomeScreen } from "@app/auth/welcome";
import { ChannelScreen } from "@app/channel";
import { ChatScreen } from "@app/chat";
import { ErrorScreen } from "@app/error";
import { Root } from "@app/root";
import { SpaceScreen } from "@app/space";
import { TrendingScreen } from "@app/trending";
import { UserScreen } from "@app/user";
import { AppLayout } from "@shared/appLayout";
import { AuthLayout } from "@shared/authLayout";
import { Protected } from "@shared/protected";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Protected>
				<Root />
			</Protected>
		),
		errorElement: <ErrorScreen />,
	},
	{
		path: "/auth",
		element: <AuthLayout />,
		children: [
			{ path: "welcome", element: <WelcomeScreen /> },
			{ path: "onboarding", element: <OnboardingScreen /> },
			{
				path: "import",
				element: <AuthImportScreen />,
				children: [
					{ path: "", element: <ImportStep1Screen /> },
					{ path: "step-2", element: <ImportStep2Screen /> },
				],
			},
			{
				path: "create",
				element: <AuthCreateScreen />,
				children: [
					{ path: "", element: <CreateStep1Screen /> },
					{ path: "step-2", element: <CreateStep2Screen /> },
					{ path: "step-3", element: <CreateStep3Screen /> },
					{ path: "step-4", element: <CreateStep4Screen /> },
				],
			},
		],
	},
	{
		path: "/app",
		element: (
			<Protected>
				<AppLayout />
			</Protected>
		),
		children: [
			{ path: "space", element: <SpaceScreen /> },
			{ path: "trending", element: <TrendingScreen /> },
			{ path: "user/:pubkey", element: <UserScreen /> },
			{ path: "chat/:pubkey", element: <ChatScreen /> },
			{ path: "channel/:id", element: <ChannelScreen /> },
		],
	},
]);

export default function App() {
	return (
		<RouterProvider
			router={router}
			fallbackElement={<p>Loading..</p>}
			future={{ v7_startTransition: true }}
		/>
	);
}
