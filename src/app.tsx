import { fetch } from '@tauri-apps/plugin-http';
import { RouterProvider, createBrowserRouter, defer, redirect } from 'react-router-dom';
import { ErrorScreen } from '@app/error';
import { useStorage } from '@libs/ark';
import { LoaderIcon } from '@shared/icons';
import { AppLayout } from '@shared/layouts/app';
import { AuthLayout } from '@shared/layouts/auth';
import { ComposerLayout } from '@shared/layouts/composer';
import { HomeLayout } from '@shared/layouts/home';
import { SettingsLayout } from '@shared/layouts/settings';

export default function App() {
  const storage = useStorage();

  const router = createBrowserRouter([
    {
      element: <AppLayout platform={storage.platform} />,
      children: [
        {
          path: '/',
          element: <HomeLayout />,
          errorElement: <ErrorScreen />,
          loader: async () => {
            if (!storage.account) return redirect('auth/welcome');
            return null;
          },
          children: [
            {
              index: true,
              async lazy() {
                const { HomeScreen } = await import('@app/home');
                return { Component: HomeScreen };
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
              loader: async ({ params }) => {
                return defer({
                  relay: fetch(`https://${params.url}`, {
                    method: 'GET',
                    headers: {
                      Accept: 'application/nostr+json',
                    },
                  }).then((res) => res.json()),
                });
              },
              async lazy() {
                const { RelayScreen } = await import('@app/relays/relay');
                return { Component: RelayScreen };
              },
            },
            {
              path: 'new',
              element: <ComposerLayout />,
              children: [
                {
                  index: true,
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
              path: 'settings',
              element: <SettingsLayout />,
              children: [
                {
                  index: true,
                  async lazy() {
                    const { UserSettingScreen } = await import('@app/settings');
                    return { Component: UserSettingScreen };
                  },
                },
                {
                  path: 'edit-profile',
                  async lazy() {
                    const { EditProfileScreen } = await import(
                      '@app/settings/editProfile'
                    );
                    return { Component: EditProfileScreen };
                  },
                },
                {
                  path: 'edit-contact',
                  async lazy() {
                    const { EditContactScreen } = await import(
                      '@app/settings/editContact'
                    );
                    return { Component: EditContactScreen };
                  },
                },
                {
                  path: 'general',
                  async lazy() {
                    const { GeneralSettingScreen } = await import(
                      '@app/settings/general'
                    );
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
                    const { AdvancedSettingScreen } = await import(
                      '@app/settings/advanced'
                    );
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
          ],
        },
        {
          path: 'depot',
          children: [
            {
              index: true,
              loader: () => {
                const depot = storage.checkDepot();
                if (!depot) return redirect('/depot/onboarding/');
                return null;
              },
              async lazy() {
                const { DepotScreen } = await import('@app/depot');
                return { Component: DepotScreen };
              },
            },
            {
              path: 'onboarding',
              async lazy() {
                const { DepotOnboardingScreen } = await import('@app/depot/onboarding');
                return { Component: DepotOnboardingScreen };
              },
            },
          ],
        },
      ],
    },
    {
      path: 'auth',
      element: <AuthLayout platform={storage.platform} />,
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
