import { message } from '@tauri-apps/plugin-dialog';
import { fetch } from '@tauri-apps/plugin-http';
import { RouterProvider, createBrowserRouter, defer, redirect } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

import { ChatsScreen } from '@app/chats';
import { ErrorScreen } from '@app/error';
import { ExploreScreen } from '@app/explore';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import { AppLayout } from '@shared/layouts/app';
import { AuthLayout } from '@shared/layouts/auth';
import { NewLayout } from '@shared/layouts/new';
import { NoteLayout } from '@shared/layouts/note';
import { SettingsLayout } from '@shared/layouts/settings';

import './app.css';

export default function App() {
  const { db } = useStorage();

  const accountLoader = async () => {
    try {
      // redirect to welcome screen if none user exist
      const totalAccount = await db.checkAccount();
      if (totalAccount === 0) return redirect('/auth/welcome');

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
            const { HomeScreen } = await import('@app/home');
            return { Component: HomeScreen };
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
      path: '/new',
      element: <NewLayout />,
      errorElement: <ErrorScreen />,
      children: [
        {
          path: '',
          async lazy() {
            const { NewPostScreen } = await import('@app/new/post');
            return { Component: NewPostScreen };
          },
        },
        {
          path: 'article',
          async lazy() {
            const { NewArticleScreen } = await import('@app/new/article');
            return { Component: NewArticleScreen };
          },
        },
        {
          path: 'file',
          async lazy() {
            const { NewFileScreen } = await import('@app/new/file');
            return { Component: NewFileScreen };
          },
        },
        {
          path: 'privkey',
          async lazy() {
            const { NewPrivkeyScreen } = await import('@app/new/privkey');
            return { Component: NewPrivkeyScreen };
          },
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
          path: 'create',
          async lazy() {
            const { CreateAccountScreen } = await import('@app/auth/create');
            return { Component: CreateAccountScreen };
          },
        },
        {
          path: 'import',
          async lazy() {
            const { ImportAccountScreen } = await import('@app/auth/import');
            return { Component: ImportAccountScreen };
          },
        },
        {
          path: 'onboarding',
          async lazy() {
            const { OnboardingScreen } = await import('@app/auth/onboarding');
            return { Component: OnboardingScreen };
          },
        },
        {
          path: 'follow',
          async lazy() {
            const { FollowScreen } = await import('@app/auth/follow');
            return { Component: FollowScreen };
          },
        },
        {
          path: 'finish',
          async lazy() {
            const { FinishScreen } = await import('@app/auth/finish');
            return { Component: FinishScreen };
          },
        },
        {
          path: 'tutorials/note',
          async lazy() {
            const { TutorialNoteScreen } = await import('@app/auth/tutorials/note');
            return { Component: TutorialNoteScreen };
          },
        },
        {
          path: 'tutorials/widget',
          async lazy() {
            const { TutorialWidgetScreen } = await import('@app/auth/tutorials/widget');
            return { Component: TutorialWidgetScreen };
          },
        },
        {
          path: 'tutorials/posting',
          async lazy() {
            const { TutorialPostingScreen } = await import('@app/auth/tutorials/posting');
            return { Component: TutorialPostingScreen };
          },
        },
        {
          path: 'tutorials/finish',
          async lazy() {
            const { TutorialFinishScreen } = await import('@app/auth/tutorials/finish');
            return { Component: TutorialFinishScreen };
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
            const { UserSettingScreen } = await import('@app/settings');
            return { Component: UserSettingScreen };
          },
        },
        {
          path: 'edit-profile',
          async lazy() {
            const { EditProfileScreen } = await import('@app/settings/editProfile');
            return { Component: EditProfileScreen };
          },
        },
        {
          path: 'edit-contact',
          async lazy() {
            const { EditContactScreen } = await import('@app/settings/editContact');
            return { Component: EditContactScreen };
          },
        },
        {
          path: 'general',
          async lazy() {
            const { GeneralSettingScreen } = await import('@app/settings/general');
            return { Component: GeneralSettingScreen };
          },
        },
        {
          path: 'backup',
          async lazy() {
            const { BackupSettingScreen } = await import('@app/settings/backup');
            return { Component: BackupSettingScreen };
          },
        },
        {
          path: 'advanced',
          async lazy() {
            const { AdvancedSettingScreen } = await import('@app/settings/advanced');
            return { Component: AdvancedSettingScreen };
          },
        },
        {
          path: 'about',
          async lazy() {
            const { AboutScreen } = await import('@app/settings/about');
            return { Component: AboutScreen };
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
          <LoaderIcon className="h-6 w-6 animate-spin" />
        </div>
      }
      future={{ v7_startTransition: true }}
    />
  );
}
