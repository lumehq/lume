import { message } from '@tauri-apps/plugin-dialog';
import { fetch } from '@tauri-apps/plugin-http';
import { RouterProvider, createBrowserRouter, defer, redirect } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

import { AuthCreateScreen } from '@app/auth/create';
import { AuthImportScreen } from '@app/auth/import';
import { OnboardingScreen } from '@app/auth/onboarding';
import { ChatsScreen } from '@app/chats';
import { ErrorScreen } from '@app/error';
import { ExploreScreen } from '@app/explore';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import { AppLayout } from '@shared/layouts/app';
import { AuthLayout } from '@shared/layouts/auth';
import { NoteLayout } from '@shared/layouts/note';
import { SettingsLayout } from '@shared/layouts/settings';

import './app.css';

export default function App() {
  const { db } = useStorage();

  const accountLoader = async () => {
    try {
      const totalAccount = await db.checkAccount();

      const onboarding = localStorage.getItem('onboarding');
      const step = JSON.parse(onboarding).state.step || null;

      // redirect to welcome screen if none user exist
      if (totalAccount === 0) return redirect('/auth/welcome');

      // restart onboarding process
      if (step) return redirect(step);

      return null;
    } catch (e) {
      await message(e, { title: 'An unexpected error has occurred', type: 'error' });
    }
  };

  const relayLoader = async ({ params }) => {
    return defer({
      relay: fetch(`https://${params.url}`, {
        method: 'GET',
        headers: {
          Accept: 'application/nostr+json',
        },
      }).then((res) => res.json()),
    });
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      errorElement: <ErrorScreen />,
      loader: accountLoader,
      children: [
        {
          path: '',
          async lazy() {
            const { SpaceScreen } = await import('@app/space');
            return { Component: SpaceScreen };
          },
        },
        {
          path: 'users/:pubkey',
          async lazy() {
            const { UserScreen } = await import('@app/users');
            return { Component: UserScreen };
          },
        },
        {
          path: 'notifications',
          async lazy() {
            const { NotificationScreen } = await import('@app/notifications');
            return { Component: NotificationScreen };
          },
        },
        {
          path: 'nwc',
          async lazy() {
            const { NWCScreen } = await import('@app/nwc');
            return { Component: NWCScreen };
          },
        },
        {
          path: 'relays',
          async lazy() {
            const { RelaysScreen } = await import('@app/relays');
            return { Component: RelaysScreen };
          },
        },
        {
          path: 'relays/:url',
          loader: relayLoader,
          async lazy() {
            const { RelayScreen } = await import('@app/relays/relay');
            return { Component: RelayScreen };
          },
        },
        {
          path: 'communities',
          async lazy() {
            const { CommunitiesScreen } = await import('@app/communities');
            return { Component: CommunitiesScreen };
          },
        },
        {
          path: 'explore',
          element: (
            <ReactFlowProvider>
              <ExploreScreen />
            </ReactFlowProvider>
          ),
          errorElement: <ErrorScreen />,
        },
        {
          path: 'chats',
          element: <ChatsScreen />,
          errorElement: <ErrorScreen />,
          children: [
            {
              path: 'chat/:pubkey',
              async lazy() {
                const { ChatScreen } = await import('@app/chats/chat');
                return { Component: ChatScreen };
              },
            },
          ],
        },
      ],
    },
    {
      path: '/notes',
      element: <NoteLayout />,
      errorElement: <ErrorScreen />,
      children: [
        {
          path: 'text/:id',
          async lazy() {
            const { TextNoteScreen } = await import('@app/notes/text');
            return { Component: TextNoteScreen };
          },
        },
        {
          path: 'article/:id',
          async lazy() {
            const { ArticleNoteScreen } = await import('@app/notes/article');
            return { Component: ArticleNoteScreen };
          },
        },
      ],
    },
    {
      path: '/auth',
      element: <AuthLayout />,
      errorElement: <ErrorScreen />,
      children: [
        {
          path: 'welcome',
          async lazy() {
            const { WelcomeScreen } = await import('@app/auth/welcome');
            return { Component: WelcomeScreen };
          },
        },
        {
          path: 'import',
          element: <AuthImportScreen />,
          errorElement: <ErrorScreen />,
          children: [
            {
              path: '',
              async lazy() {
                const { ImportStep1Screen } = await import('@app/auth/import/step-1');
                return { Component: ImportStep1Screen };
              },
            },
            {
              path: 'step-2',
              async lazy() {
                const { ImportStep2Screen } = await import('@app/auth/import/step-2');
                return { Component: ImportStep2Screen };
              },
            },
          ],
        },
        {
          path: 'create',
          element: <AuthCreateScreen />,
          errorElement: <ErrorScreen />,
          children: [
            {
              path: '',
              async lazy() {
                const { CreateStep1Screen } = await import('@app/auth/create/step-1');
                return { Component: CreateStep1Screen };
              },
            },
            {
              path: 'step-2',
              async lazy() {
                const { CreateStep2Screen } = await import('@app/auth/create/step-2');
                return { Component: CreateStep2Screen };
              },
            },
          ],
        },
        {
          path: 'onboarding',
          element: <OnboardingScreen />,
          errorElement: <ErrorScreen />,
          children: [
            {
              path: '',
              async lazy() {
                const { OnboardStep1Screen } = await import(
                  '@app/auth/onboarding/step-1'
                );
                return { Component: OnboardStep1Screen };
              },
            },
            {
              path: 'step-2',
              async lazy() {
                const { OnboardStep2Screen } = await import(
                  '@app/auth/onboarding/step-2'
                );
                return { Component: OnboardStep2Screen };
              },
            },
          ],
        },
        {
          path: 'complete',
          async lazy() {
            const { CompleteScreen } = await import('@app/auth/complete');
            return { Component: CompleteScreen };
          },
        },
      ],
    },
    {
      path: '/settings',
      element: <SettingsLayout />,
      errorElement: <ErrorScreen />,
      children: [
        {
          path: '',
          async lazy() {
            const { GeneralSettingsScreen } = await import('@app/settings/general');
            return { Component: GeneralSettingsScreen };
          },
        },
        {
          path: 'backup',
          async lazy() {
            const { AccountSettingsScreen } = await import('@app/settings/account');
            return { Component: AccountSettingsScreen };
          },
        },
      ],
    },
  ]);

  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-6 w-6 animate-spin text-white" />
        </div>
      }
      future={{ v7_startTransition: true }}
    />
  );
}
