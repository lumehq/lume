import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';

import { AuthCreateScreen } from '@app/auth/create';
import { AuthImportScreen } from '@app/auth/import';
import { OnboardingScreen } from '@app/auth/onboarding';
import { ErrorScreen } from '@app/error';

import { getActiveAccount } from '@libs/storage';

import { AppLayout } from '@shared/appLayout';
import { AuthLayout } from '@shared/authLayout';
import { LoaderIcon } from '@shared/icons';
import { SettingsLayout } from '@shared/settingsLayout';

import './index.css';

const appLoader = async () => {
  try {
    const account = await getActiveAccount();
    const stronghold = sessionStorage.getItem('stronghold');
    const privkey = JSON.parse(stronghold).state.privkey || null;
    const onboarding = localStorage.getItem('onboarding');
    const step = JSON.parse(onboarding).state.step || null;

    if (step) {
      return redirect(step);
    }

    if (!account) {
      return redirect('/auth/welcome');
    } else {
      if (account.privkey.length > 35) {
        return redirect('/auth/migrate');
      }

      if (!privkey) {
        return redirect('/auth/unlock');
      }
    }

    return null;
  } catch (e) {
    throw new Error('App failed to load');
  }
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorScreen />,
    loader: appLoader,
    children: [
      {
        path: '',
        async lazy() {
          const { SpaceScreen } = await import('@app/space');
          return { Component: SpaceScreen };
        },
      },
      {
        path: 'trending',
        async lazy() {
          const { TrendingScreen } = await import('@app/trending');
          return { Component: TrendingScreen };
        },
      },
      {
        path: 'events/:id',
        async lazy() {
          const { EventScreen } = await import('@app/events');
          return { Component: EventScreen };
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
        path: 'chats/:pubkey',
        async lazy() {
          const { ChatScreen } = await import('@app/chats');
          return { Component: ChatScreen };
        },
      },
    ],
  },
  {
    path: '/splashscreen',
    errorElement: <ErrorScreen />,
    async lazy() {
      const { SplashScreen } = await import('@app/splash');
      return { Component: SplashScreen };
    },
  },
  {
    path: '/auth',
    element: <AuthLayout />,
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
          {
            path: 'step-3',
            async lazy() {
              const { ImportStep3Screen } = await import('@app/auth/import/step-3');
              return { Component: ImportStep3Screen };
            },
          },
        ],
      },
      {
        path: 'create',
        element: <AuthCreateScreen />,
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
          {
            path: 'step-3',
            async lazy() {
              const { CreateStep3Screen } = await import('@app/auth/create/step-3');
              return { Component: CreateStep3Screen };
            },
          },
        ],
      },
      {
        path: 'onboarding',
        element: <OnboardingScreen />,
        children: [
          {
            path: '',
            async lazy() {
              const { OnboardStep1Screen } = await import('@app/auth/onboarding/step-1');
              return { Component: OnboardStep1Screen };
            },
          },
          {
            path: 'step-2',
            async lazy() {
              const { OnboardStep2Screen } = await import('@app/auth/onboarding/step-2');
              return { Component: OnboardStep2Screen };
            },
          },
          {
            path: 'step-3',
            async lazy() {
              const { OnboardStep3Screen } = await import('@app/auth/onboarding/step-3');
              return { Component: OnboardStep3Screen };
            },
          },
        ],
      },
      {
        path: 'unlock',
        async lazy() {
          const { UnlockScreen } = await import('@app/auth/unlock');
          return { Component: UnlockScreen };
        },
      },
      {
        path: 'migrate',
        async lazy() {
          const { MigrateScreen } = await import('@app/auth/migrate');
          return { Component: MigrateScreen };
        },
      },
      {
        path: 'reset',
        async lazy() {
          const { ResetScreen } = await import('@app/auth/reset');
          return { Component: ResetScreen };
        },
      },
    ],
  },
  {
    path: '/settings',
    element: <SettingsLayout />,
    children: [
      {
        path: 'general',
        async lazy() {
          const { GeneralSettingsScreen } = await import('@app/settings/general');
          return { Component: GeneralSettingsScreen };
        },
      },
      {
        path: 'shortcuts',
        async lazy() {
          const { ShortcutsSettingsScreen } = await import('@app/settings/shortcuts');
          return { Component: ShortcutsSettingsScreen };
        },
      },
      {
        path: 'account',
        async lazy() {
          const { AccountSettingsScreen } = await import('@app/settings/account');
          return { Component: AccountSettingsScreen };
        },
      },
    ],
  },
]);

export default function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <div className="flex h-full w-full items-center justify-center bg-black/90">
          <LoaderIcon className="h-6 w-6 animate-spin text-white" />
        </div>
      }
      future={{ v7_startTransition: true }}
    />
  );
}
