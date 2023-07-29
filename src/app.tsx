import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AuthCreateScreen } from '@app/auth/create';
import { CreateStep1Screen } from '@app/auth/create/step-1';
import { CreateStep2Screen } from '@app/auth/create/step-2';
import { CreateStep3Screen } from '@app/auth/create/step-3';
import { CreateStep4Screen } from '@app/auth/create/step-4';
import { CreateStep5Screen } from '@app/auth/create/step-5';
import { AuthImportScreen } from '@app/auth/import';
import { ImportStep1Screen } from '@app/auth/import/step-1';
import { ImportStep2Screen } from '@app/auth/import/step-2';
import { ImportStep3Screen } from '@app/auth/import/step-3';
import { MigrateScreen } from '@app/auth/migrate';
import { OnboardingScreen } from '@app/auth/onboarding';
import { ResetScreen } from '@app/auth/reset';
import { UnlockScreen } from '@app/auth/unlock';
import { WelcomeScreen } from '@app/auth/welcome';
import { ChannelScreen } from '@app/channel';
import { ChatScreen } from '@app/chats';
import { ErrorScreen } from '@app/error';
import { NoteScreen } from '@app/note';
import { Root } from '@app/root';
import { AccountSettingsScreen } from '@app/settings/account';
import { GeneralSettingsScreen } from '@app/settings/general';
import { ShortcutsSettingsScreen } from '@app/settings/shortcuts';
import { SpaceScreen } from '@app/space';
import { TrendingScreen } from '@app/trending';
import { UserScreen } from '@app/users';

import { AppLayout } from '@shared/appLayout';
import { AuthLayout } from '@shared/authLayout';
import { Protected } from '@shared/protected';
import { SettingsLayout } from '@shared/settingsLayout';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      // @ts-expect-error, todo
      <Protected>
        <Root />
      </Protected>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'welcome', element: <WelcomeScreen /> },
      { path: 'onboarding', element: <OnboardingScreen /> },
      {
        path: 'import',
        element: <AuthImportScreen />,
        children: [
          { path: '', element: <ImportStep1Screen /> },
          { path: 'step-2', element: <ImportStep2Screen /> },
          { path: 'step-3', element: <ImportStep3Screen /> },
        ],
      },
      {
        path: 'create',
        element: <AuthCreateScreen />,
        children: [
          { path: '', element: <CreateStep1Screen /> },
          { path: 'step-2', element: <CreateStep2Screen /> },
          { path: 'step-3', element: <CreateStep3Screen /> },
          { path: 'step-4', element: <CreateStep4Screen /> },
          { path: 'step-5', element: <CreateStep5Screen /> },
        ],
      },
      { path: 'unlock', element: <UnlockScreen /> },
      { path: 'migrate', element: <MigrateScreen /> },
      { path: 'reset', element: <ResetScreen /> },
    ],
  },
  {
    path: '/app',
    element: (
      // @ts-expect-error, todo
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      { path: 'space', element: <SpaceScreen /> },
      { path: 'trending', element: <TrendingScreen /> },
      { path: 'note/:id', element: <NoteScreen /> },
      { path: 'users/:pubkey', element: <UserScreen /> },
      { path: 'chats/:pubkey', element: <ChatScreen /> },
      { path: 'channel/:id', element: <ChannelScreen /> },
    ],
  },
  {
    path: '/settings',
    element: (
      // @ts-expect-error, todo
      <Protected>
        <SettingsLayout />
      </Protected>
    ),
    children: [
      { path: 'general', element: <GeneralSettingsScreen /> },
      { path: 'shortcuts', element: <ShortcutsSettingsScreen /> },
      { path: 'account', element: <AccountSettingsScreen /> },
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
