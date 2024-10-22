/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SetInterestImport } from './routes/set-interest'
import { Route as SetGroupImport } from './routes/set-group'
import { Route as BootstrapRelaysImport } from './routes/bootstrap-relays'
import { Route as LayoutImport } from './routes/_layout'
import { Route as NewPostIndexImport } from './routes/new-post/index'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as ZapIdImport } from './routes/zap.$id'
import { Route as ColumnsLayoutImport } from './routes/columns/_layout'
import { Route as SettingsIdWalletImport } from './routes/settings.$id/wallet'
import { Route as SettingsIdRelayImport } from './routes/settings.$id/relay'
import { Route as SettingsIdProfileImport } from './routes/settings.$id/profile'
import { Route as SettingsIdGeneralImport } from './routes/settings.$id/general'
import { Route as SettingsIdBitcoinConnectImport } from './routes/settings.$id/bitcoin-connect'
import { Route as ColumnsLayoutGlobalImport } from './routes/columns/_layout/global'
import { Route as ColumnsLayoutCreateNewsfeedImport } from './routes/columns/_layout/create-newsfeed'
import { Route as ColumnsLayoutStoriesIdImport } from './routes/columns/_layout/stories.$id'
import { Route as ColumnsLayoutNewsfeedIdImport } from './routes/columns/_layout/newsfeed.$id'
import { Route as ColumnsLayoutInterestsIdImport } from './routes/columns/_layout/interests.$id'
import { Route as ColumnsLayoutGroupsIdImport } from './routes/columns/_layout/groups.$id'
import { Route as ColumnsLayoutCreateNewsfeedUsersImport } from './routes/columns/_layout/create-newsfeed.users'
import { Route as ColumnsLayoutCreateNewsfeedF2fImport } from './routes/columns/_layout/create-newsfeed.f2f'

// Create Virtual Routes

const ColumnsImport = createFileRoute('/columns')()
const ResetLazyImport = createFileRoute('/reset')()
const NewLazyImport = createFileRoute('/new')()
const SettingsIdLazyImport = createFileRoute('/settings/$id')()
const SetSignerIdLazyImport = createFileRoute('/set-signer/$id')()
const AuthWatchLazyImport = createFileRoute('/auth/watch')()
const AuthImportLazyImport = createFileRoute('/auth/import')()
const AuthConnectLazyImport = createFileRoute('/auth/connect')()
const ColumnsLayoutTrendingLazyImport = createFileRoute(
  '/columns/_layout/trending',
)()
const ColumnsLayoutSearchLazyImport = createFileRoute(
  '/columns/_layout/search',
)()
const ColumnsLayoutOnboardingLazyImport = createFileRoute(
  '/columns/_layout/onboarding',
)()
const ColumnsLayoutLaunchpadLazyImport = createFileRoute(
  '/columns/_layout/launchpad',
)()
const ColumnsLayoutUsersIdLazyImport = createFileRoute(
  '/columns/_layout/users/$id',
)()
const ColumnsLayoutRepliesIdLazyImport = createFileRoute(
  '/columns/_layout/replies/$id',
)()
const ColumnsLayoutNotificationIdLazyImport = createFileRoute(
  '/columns/_layout/notification/$id',
)()
const ColumnsLayoutEventsIdLazyImport = createFileRoute(
  '/columns/_layout/events/$id',
)()

// Create/Update Routes

const ColumnsRoute = ColumnsImport.update({
  path: '/columns',
  getParentRoute: () => rootRoute,
} as any)

const ResetLazyRoute = ResetLazyImport.update({
  path: '/reset',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/reset.lazy').then((d) => d.Route))

const NewLazyRoute = NewLazyImport.update({
  path: '/new',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/new.lazy').then((d) => d.Route))

const SetInterestRoute = SetInterestImport.update({
  path: '/set-interest',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/set-interest.lazy').then((d) => d.Route))

const SetGroupRoute = SetGroupImport.update({
  path: '/set-group',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/set-group.lazy').then((d) => d.Route))

const BootstrapRelaysRoute = BootstrapRelaysImport.update({
  path: '/bootstrap-relays',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/bootstrap-relays.lazy').then((d) => d.Route),
)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/_layout.lazy').then((d) => d.Route))

const NewPostIndexRoute = NewPostIndexImport.update({
  path: '/new-post/',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any).lazy(() => import('./routes/_layout/index.lazy').then((d) => d.Route))

const SettingsIdLazyRoute = SettingsIdLazyImport.update({
  path: '/settings/$id',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/settings.$id.lazy').then((d) => d.Route))

const SetSignerIdLazyRoute = SetSignerIdLazyImport.update({
  path: '/set-signer/$id',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/set-signer.$id.lazy').then((d) => d.Route),
)

const AuthWatchLazyRoute = AuthWatchLazyImport.update({
  path: '/auth/watch',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/auth/watch.lazy').then((d) => d.Route))

const AuthImportLazyRoute = AuthImportLazyImport.update({
  path: '/auth/import',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/auth/import.lazy').then((d) => d.Route))

const AuthConnectLazyRoute = AuthConnectLazyImport.update({
  path: '/auth/connect',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/auth/connect.lazy').then((d) => d.Route))

const ZapIdRoute = ZapIdImport.update({
  path: '/zap/$id',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/zap.$id.lazy').then((d) => d.Route))

const ColumnsLayoutRoute = ColumnsLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => ColumnsRoute,
} as any)

const ColumnsLayoutTrendingLazyRoute = ColumnsLayoutTrendingLazyImport.update({
  path: '/trending',
  getParentRoute: () => ColumnsLayoutRoute,
} as any).lazy(() =>
  import('./routes/columns/_layout/trending.lazy').then((d) => d.Route),
)

const ColumnsLayoutSearchLazyRoute = ColumnsLayoutSearchLazyImport.update({
  path: '/search',
  getParentRoute: () => ColumnsLayoutRoute,
} as any).lazy(() =>
  import('./routes/columns/_layout/search.lazy').then((d) => d.Route),
)

const ColumnsLayoutOnboardingLazyRoute =
  ColumnsLayoutOnboardingLazyImport.update({
    path: '/onboarding',
    getParentRoute: () => ColumnsLayoutRoute,
  } as any).lazy(() =>
    import('./routes/columns/_layout/onboarding.lazy').then((d) => d.Route),
  )

const ColumnsLayoutLaunchpadLazyRoute = ColumnsLayoutLaunchpadLazyImport.update(
  {
    path: '/launchpad',
    getParentRoute: () => ColumnsLayoutRoute,
  } as any,
).lazy(() =>
  import('./routes/columns/_layout/launchpad.lazy').then((d) => d.Route),
)

const SettingsIdWalletRoute = SettingsIdWalletImport.update({
  path: '/wallet',
  getParentRoute: () => SettingsIdLazyRoute,
} as any).lazy(() =>
  import('./routes/settings.$id/wallet.lazy').then((d) => d.Route),
)

const SettingsIdRelayRoute = SettingsIdRelayImport.update({
  path: '/relay',
  getParentRoute: () => SettingsIdLazyRoute,
} as any).lazy(() =>
  import('./routes/settings.$id/relay.lazy').then((d) => d.Route),
)

const SettingsIdProfileRoute = SettingsIdProfileImport.update({
  path: '/profile',
  getParentRoute: () => SettingsIdLazyRoute,
} as any).lazy(() =>
  import('./routes/settings.$id/profile.lazy').then((d) => d.Route),
)

const SettingsIdGeneralRoute = SettingsIdGeneralImport.update({
  path: '/general',
  getParentRoute: () => SettingsIdLazyRoute,
} as any).lazy(() =>
  import('./routes/settings.$id/general.lazy').then((d) => d.Route),
)

const SettingsIdBitcoinConnectRoute = SettingsIdBitcoinConnectImport.update({
  path: '/bitcoin-connect',
  getParentRoute: () => SettingsIdLazyRoute,
} as any).lazy(() =>
  import('./routes/settings.$id/bitcoin-connect.lazy').then((d) => d.Route),
)

const ColumnsLayoutGlobalRoute = ColumnsLayoutGlobalImport.update({
  path: '/global',
  getParentRoute: () => ColumnsLayoutRoute,
} as any)

const ColumnsLayoutCreateNewsfeedRoute =
  ColumnsLayoutCreateNewsfeedImport.update({
    path: '/create-newsfeed',
    getParentRoute: () => ColumnsLayoutRoute,
  } as any)

const ColumnsLayoutUsersIdLazyRoute = ColumnsLayoutUsersIdLazyImport.update({
  path: '/users/$id',
  getParentRoute: () => ColumnsLayoutRoute,
} as any).lazy(() =>
  import('./routes/columns/_layout/users.$id.lazy').then((d) => d.Route),
)

const ColumnsLayoutRepliesIdLazyRoute = ColumnsLayoutRepliesIdLazyImport.update(
  {
    path: '/replies/$id',
    getParentRoute: () => ColumnsLayoutRoute,
  } as any,
).lazy(() =>
  import('./routes/columns/_layout/replies.$id.lazy').then((d) => d.Route),
)

const ColumnsLayoutNotificationIdLazyRoute =
  ColumnsLayoutNotificationIdLazyImport.update({
    path: '/notification/$id',
    getParentRoute: () => ColumnsLayoutRoute,
  } as any).lazy(() =>
    import('./routes/columns/_layout/notification.$id.lazy').then(
      (d) => d.Route,
    ),
  )

const ColumnsLayoutEventsIdLazyRoute = ColumnsLayoutEventsIdLazyImport.update({
  path: '/events/$id',
  getParentRoute: () => ColumnsLayoutRoute,
} as any).lazy(() =>
  import('./routes/columns/_layout/events.$id.lazy').then((d) => d.Route),
)

const ColumnsLayoutStoriesIdRoute = ColumnsLayoutStoriesIdImport.update({
  path: '/stories/$id',
  getParentRoute: () => ColumnsLayoutRoute,
} as any).lazy(() =>
  import('./routes/columns/_layout/stories.$id.lazy').then((d) => d.Route),
)

const ColumnsLayoutNewsfeedIdRoute = ColumnsLayoutNewsfeedIdImport.update({
  path: '/newsfeed/$id',
  getParentRoute: () => ColumnsLayoutRoute,
} as any).lazy(() =>
  import('./routes/columns/_layout/newsfeed.$id.lazy').then((d) => d.Route),
)

const ColumnsLayoutInterestsIdRoute = ColumnsLayoutInterestsIdImport.update({
  path: '/interests/$id',
  getParentRoute: () => ColumnsLayoutRoute,
} as any).lazy(() =>
  import('./routes/columns/_layout/interests.$id.lazy').then((d) => d.Route),
)

const ColumnsLayoutGroupsIdRoute = ColumnsLayoutGroupsIdImport.update({
  path: '/groups/$id',
  getParentRoute: () => ColumnsLayoutRoute,
} as any).lazy(() =>
  import('./routes/columns/_layout/groups.$id.lazy').then((d) => d.Route),
)

const ColumnsLayoutCreateNewsfeedUsersRoute =
  ColumnsLayoutCreateNewsfeedUsersImport.update({
    path: '/users',
    getParentRoute: () => ColumnsLayoutCreateNewsfeedRoute,
  } as any)

const ColumnsLayoutCreateNewsfeedF2fRoute =
  ColumnsLayoutCreateNewsfeedF2fImport.update({
    path: '/f2f',
    getParentRoute: () => ColumnsLayoutCreateNewsfeedRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/bootstrap-relays': {
      id: '/bootstrap-relays'
      path: '/bootstrap-relays'
      fullPath: '/bootstrap-relays'
      preLoaderRoute: typeof BootstrapRelaysImport
      parentRoute: typeof rootRoute
    }
    '/set-group': {
      id: '/set-group'
      path: '/set-group'
      fullPath: '/set-group'
      preLoaderRoute: typeof SetGroupImport
      parentRoute: typeof rootRoute
    }
    '/set-interest': {
      id: '/set-interest'
      path: '/set-interest'
      fullPath: '/set-interest'
      preLoaderRoute: typeof SetInterestImport
      parentRoute: typeof rootRoute
    }
    '/new': {
      id: '/new'
      path: '/new'
      fullPath: '/new'
      preLoaderRoute: typeof NewLazyImport
      parentRoute: typeof rootRoute
    }
    '/reset': {
      id: '/reset'
      path: '/reset'
      fullPath: '/reset'
      preLoaderRoute: typeof ResetLazyImport
      parentRoute: typeof rootRoute
    }
    '/columns': {
      id: '/columns'
      path: '/columns'
      fullPath: '/columns'
      preLoaderRoute: typeof ColumnsImport
      parentRoute: typeof rootRoute
    }
    '/columns/_layout': {
      id: '/columns/_layout'
      path: '/columns'
      fullPath: '/columns'
      preLoaderRoute: typeof ColumnsLayoutImport
      parentRoute: typeof ColumnsRoute
    }
    '/zap/$id': {
      id: '/zap/$id'
      path: '/zap/$id'
      fullPath: '/zap/$id'
      preLoaderRoute: typeof ZapIdImport
      parentRoute: typeof rootRoute
    }
    '/auth/connect': {
      id: '/auth/connect'
      path: '/auth/connect'
      fullPath: '/auth/connect'
      preLoaderRoute: typeof AuthConnectLazyImport
      parentRoute: typeof rootRoute
    }
    '/auth/import': {
      id: '/auth/import'
      path: '/auth/import'
      fullPath: '/auth/import'
      preLoaderRoute: typeof AuthImportLazyImport
      parentRoute: typeof rootRoute
    }
    '/auth/watch': {
      id: '/auth/watch'
      path: '/auth/watch'
      fullPath: '/auth/watch'
      preLoaderRoute: typeof AuthWatchLazyImport
      parentRoute: typeof rootRoute
    }
    '/set-signer/$id': {
      id: '/set-signer/$id'
      path: '/set-signer/$id'
      fullPath: '/set-signer/$id'
      preLoaderRoute: typeof SetSignerIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings/$id': {
      id: '/settings/$id'
      path: '/settings/$id'
      fullPath: '/settings/$id'
      preLoaderRoute: typeof SettingsIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/new-post/': {
      id: '/new-post/'
      path: '/new-post'
      fullPath: '/new-post'
      preLoaderRoute: typeof NewPostIndexImport
      parentRoute: typeof rootRoute
    }
    '/columns/_layout/create-newsfeed': {
      id: '/columns/_layout/create-newsfeed'
      path: '/create-newsfeed'
      fullPath: '/columns/create-newsfeed'
      preLoaderRoute: typeof ColumnsLayoutCreateNewsfeedImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/global': {
      id: '/columns/_layout/global'
      path: '/global'
      fullPath: '/columns/global'
      preLoaderRoute: typeof ColumnsLayoutGlobalImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/settings/$id/bitcoin-connect': {
      id: '/settings/$id/bitcoin-connect'
      path: '/bitcoin-connect'
      fullPath: '/settings/$id/bitcoin-connect'
      preLoaderRoute: typeof SettingsIdBitcoinConnectImport
      parentRoute: typeof SettingsIdLazyImport
    }
    '/settings/$id/general': {
      id: '/settings/$id/general'
      path: '/general'
      fullPath: '/settings/$id/general'
      preLoaderRoute: typeof SettingsIdGeneralImport
      parentRoute: typeof SettingsIdLazyImport
    }
    '/settings/$id/profile': {
      id: '/settings/$id/profile'
      path: '/profile'
      fullPath: '/settings/$id/profile'
      preLoaderRoute: typeof SettingsIdProfileImport
      parentRoute: typeof SettingsIdLazyImport
    }
    '/settings/$id/relay': {
      id: '/settings/$id/relay'
      path: '/relay'
      fullPath: '/settings/$id/relay'
      preLoaderRoute: typeof SettingsIdRelayImport
      parentRoute: typeof SettingsIdLazyImport
    }
    '/settings/$id/wallet': {
      id: '/settings/$id/wallet'
      path: '/wallet'
      fullPath: '/settings/$id/wallet'
      preLoaderRoute: typeof SettingsIdWalletImport
      parentRoute: typeof SettingsIdLazyImport
    }
    '/columns/_layout/launchpad': {
      id: '/columns/_layout/launchpad'
      path: '/launchpad'
      fullPath: '/columns/launchpad'
      preLoaderRoute: typeof ColumnsLayoutLaunchpadLazyImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/onboarding': {
      id: '/columns/_layout/onboarding'
      path: '/onboarding'
      fullPath: '/columns/onboarding'
      preLoaderRoute: typeof ColumnsLayoutOnboardingLazyImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/search': {
      id: '/columns/_layout/search'
      path: '/search'
      fullPath: '/columns/search'
      preLoaderRoute: typeof ColumnsLayoutSearchLazyImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/trending': {
      id: '/columns/_layout/trending'
      path: '/trending'
      fullPath: '/columns/trending'
      preLoaderRoute: typeof ColumnsLayoutTrendingLazyImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/create-newsfeed/f2f': {
      id: '/columns/_layout/create-newsfeed/f2f'
      path: '/f2f'
      fullPath: '/columns/create-newsfeed/f2f'
      preLoaderRoute: typeof ColumnsLayoutCreateNewsfeedF2fImport
      parentRoute: typeof ColumnsLayoutCreateNewsfeedImport
    }
    '/columns/_layout/create-newsfeed/users': {
      id: '/columns/_layout/create-newsfeed/users'
      path: '/users'
      fullPath: '/columns/create-newsfeed/users'
      preLoaderRoute: typeof ColumnsLayoutCreateNewsfeedUsersImport
      parentRoute: typeof ColumnsLayoutCreateNewsfeedImport
    }
    '/columns/_layout/groups/$id': {
      id: '/columns/_layout/groups/$id'
      path: '/groups/$id'
      fullPath: '/columns/groups/$id'
      preLoaderRoute: typeof ColumnsLayoutGroupsIdImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/interests/$id': {
      id: '/columns/_layout/interests/$id'
      path: '/interests/$id'
      fullPath: '/columns/interests/$id'
      preLoaderRoute: typeof ColumnsLayoutInterestsIdImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/newsfeed/$id': {
      id: '/columns/_layout/newsfeed/$id'
      path: '/newsfeed/$id'
      fullPath: '/columns/newsfeed/$id'
      preLoaderRoute: typeof ColumnsLayoutNewsfeedIdImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/stories/$id': {
      id: '/columns/_layout/stories/$id'
      path: '/stories/$id'
      fullPath: '/columns/stories/$id'
      preLoaderRoute: typeof ColumnsLayoutStoriesIdImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/events/$id': {
      id: '/columns/_layout/events/$id'
      path: '/events/$id'
      fullPath: '/columns/events/$id'
      preLoaderRoute: typeof ColumnsLayoutEventsIdLazyImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/notification/$id': {
      id: '/columns/_layout/notification/$id'
      path: '/notification/$id'
      fullPath: '/columns/notification/$id'
      preLoaderRoute: typeof ColumnsLayoutNotificationIdLazyImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/replies/$id': {
      id: '/columns/_layout/replies/$id'
      path: '/replies/$id'
      fullPath: '/columns/replies/$id'
      preLoaderRoute: typeof ColumnsLayoutRepliesIdLazyImport
      parentRoute: typeof ColumnsLayoutImport
    }
    '/columns/_layout/users/$id': {
      id: '/columns/_layout/users/$id'
      path: '/users/$id'
      fullPath: '/columns/users/$id'
      preLoaderRoute: typeof ColumnsLayoutUsersIdLazyImport
      parentRoute: typeof ColumnsLayoutImport
    }
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutIndexRoute: typeof LayoutIndexRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutIndexRoute: LayoutIndexRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

interface ColumnsLayoutCreateNewsfeedRouteChildren {
  ColumnsLayoutCreateNewsfeedF2fRoute: typeof ColumnsLayoutCreateNewsfeedF2fRoute
  ColumnsLayoutCreateNewsfeedUsersRoute: typeof ColumnsLayoutCreateNewsfeedUsersRoute
}

const ColumnsLayoutCreateNewsfeedRouteChildren: ColumnsLayoutCreateNewsfeedRouteChildren =
  {
    ColumnsLayoutCreateNewsfeedF2fRoute: ColumnsLayoutCreateNewsfeedF2fRoute,
    ColumnsLayoutCreateNewsfeedUsersRoute:
      ColumnsLayoutCreateNewsfeedUsersRoute,
  }

const ColumnsLayoutCreateNewsfeedRouteWithChildren =
  ColumnsLayoutCreateNewsfeedRoute._addFileChildren(
    ColumnsLayoutCreateNewsfeedRouteChildren,
  )

interface ColumnsLayoutRouteChildren {
  ColumnsLayoutCreateNewsfeedRoute: typeof ColumnsLayoutCreateNewsfeedRouteWithChildren
  ColumnsLayoutGlobalRoute: typeof ColumnsLayoutGlobalRoute
  ColumnsLayoutLaunchpadLazyRoute: typeof ColumnsLayoutLaunchpadLazyRoute
  ColumnsLayoutOnboardingLazyRoute: typeof ColumnsLayoutOnboardingLazyRoute
  ColumnsLayoutSearchLazyRoute: typeof ColumnsLayoutSearchLazyRoute
  ColumnsLayoutTrendingLazyRoute: typeof ColumnsLayoutTrendingLazyRoute
  ColumnsLayoutGroupsIdRoute: typeof ColumnsLayoutGroupsIdRoute
  ColumnsLayoutInterestsIdRoute: typeof ColumnsLayoutInterestsIdRoute
  ColumnsLayoutNewsfeedIdRoute: typeof ColumnsLayoutNewsfeedIdRoute
  ColumnsLayoutStoriesIdRoute: typeof ColumnsLayoutStoriesIdRoute
  ColumnsLayoutEventsIdLazyRoute: typeof ColumnsLayoutEventsIdLazyRoute
  ColumnsLayoutNotificationIdLazyRoute: typeof ColumnsLayoutNotificationIdLazyRoute
  ColumnsLayoutRepliesIdLazyRoute: typeof ColumnsLayoutRepliesIdLazyRoute
  ColumnsLayoutUsersIdLazyRoute: typeof ColumnsLayoutUsersIdLazyRoute
}

const ColumnsLayoutRouteChildren: ColumnsLayoutRouteChildren = {
  ColumnsLayoutCreateNewsfeedRoute:
    ColumnsLayoutCreateNewsfeedRouteWithChildren,
  ColumnsLayoutGlobalRoute: ColumnsLayoutGlobalRoute,
  ColumnsLayoutLaunchpadLazyRoute: ColumnsLayoutLaunchpadLazyRoute,
  ColumnsLayoutOnboardingLazyRoute: ColumnsLayoutOnboardingLazyRoute,
  ColumnsLayoutSearchLazyRoute: ColumnsLayoutSearchLazyRoute,
  ColumnsLayoutTrendingLazyRoute: ColumnsLayoutTrendingLazyRoute,
  ColumnsLayoutGroupsIdRoute: ColumnsLayoutGroupsIdRoute,
  ColumnsLayoutInterestsIdRoute: ColumnsLayoutInterestsIdRoute,
  ColumnsLayoutNewsfeedIdRoute: ColumnsLayoutNewsfeedIdRoute,
  ColumnsLayoutStoriesIdRoute: ColumnsLayoutStoriesIdRoute,
  ColumnsLayoutEventsIdLazyRoute: ColumnsLayoutEventsIdLazyRoute,
  ColumnsLayoutNotificationIdLazyRoute: ColumnsLayoutNotificationIdLazyRoute,
  ColumnsLayoutRepliesIdLazyRoute: ColumnsLayoutRepliesIdLazyRoute,
  ColumnsLayoutUsersIdLazyRoute: ColumnsLayoutUsersIdLazyRoute,
}

const ColumnsLayoutRouteWithChildren = ColumnsLayoutRoute._addFileChildren(
  ColumnsLayoutRouteChildren,
)

interface ColumnsRouteChildren {
  ColumnsLayoutRoute: typeof ColumnsLayoutRouteWithChildren
}

const ColumnsRouteChildren: ColumnsRouteChildren = {
  ColumnsLayoutRoute: ColumnsLayoutRouteWithChildren,
}

const ColumnsRouteWithChildren =
  ColumnsRoute._addFileChildren(ColumnsRouteChildren)

interface SettingsIdLazyRouteChildren {
  SettingsIdBitcoinConnectRoute: typeof SettingsIdBitcoinConnectRoute
  SettingsIdGeneralRoute: typeof SettingsIdGeneralRoute
  SettingsIdProfileRoute: typeof SettingsIdProfileRoute
  SettingsIdRelayRoute: typeof SettingsIdRelayRoute
  SettingsIdWalletRoute: typeof SettingsIdWalletRoute
}

const SettingsIdLazyRouteChildren: SettingsIdLazyRouteChildren = {
  SettingsIdBitcoinConnectRoute: SettingsIdBitcoinConnectRoute,
  SettingsIdGeneralRoute: SettingsIdGeneralRoute,
  SettingsIdProfileRoute: SettingsIdProfileRoute,
  SettingsIdRelayRoute: SettingsIdRelayRoute,
  SettingsIdWalletRoute: SettingsIdWalletRoute,
}

const SettingsIdLazyRouteWithChildren = SettingsIdLazyRoute._addFileChildren(
  SettingsIdLazyRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteWithChildren
  '/bootstrap-relays': typeof BootstrapRelaysRoute
  '/set-group': typeof SetGroupRoute
  '/set-interest': typeof SetInterestRoute
  '/new': typeof NewLazyRoute
  '/reset': typeof ResetLazyRoute
  '/columns': typeof ColumnsLayoutRouteWithChildren
  '/zap/$id': typeof ZapIdRoute
  '/auth/connect': typeof AuthConnectLazyRoute
  '/auth/import': typeof AuthImportLazyRoute
  '/auth/watch': typeof AuthWatchLazyRoute
  '/set-signer/$id': typeof SetSignerIdLazyRoute
  '/settings/$id': typeof SettingsIdLazyRouteWithChildren
  '/': typeof LayoutIndexRoute
  '/new-post': typeof NewPostIndexRoute
  '/columns/create-newsfeed': typeof ColumnsLayoutCreateNewsfeedRouteWithChildren
  '/columns/global': typeof ColumnsLayoutGlobalRoute
  '/settings/$id/bitcoin-connect': typeof SettingsIdBitcoinConnectRoute
  '/settings/$id/general': typeof SettingsIdGeneralRoute
  '/settings/$id/profile': typeof SettingsIdProfileRoute
  '/settings/$id/relay': typeof SettingsIdRelayRoute
  '/settings/$id/wallet': typeof SettingsIdWalletRoute
  '/columns/launchpad': typeof ColumnsLayoutLaunchpadLazyRoute
  '/columns/onboarding': typeof ColumnsLayoutOnboardingLazyRoute
  '/columns/search': typeof ColumnsLayoutSearchLazyRoute
  '/columns/trending': typeof ColumnsLayoutTrendingLazyRoute
  '/columns/create-newsfeed/f2f': typeof ColumnsLayoutCreateNewsfeedF2fRoute
  '/columns/create-newsfeed/users': typeof ColumnsLayoutCreateNewsfeedUsersRoute
  '/columns/groups/$id': typeof ColumnsLayoutGroupsIdRoute
  '/columns/interests/$id': typeof ColumnsLayoutInterestsIdRoute
  '/columns/newsfeed/$id': typeof ColumnsLayoutNewsfeedIdRoute
  '/columns/stories/$id': typeof ColumnsLayoutStoriesIdRoute
  '/columns/events/$id': typeof ColumnsLayoutEventsIdLazyRoute
  '/columns/notification/$id': typeof ColumnsLayoutNotificationIdLazyRoute
  '/columns/replies/$id': typeof ColumnsLayoutRepliesIdLazyRoute
  '/columns/users/$id': typeof ColumnsLayoutUsersIdLazyRoute
}

export interface FileRoutesByTo {
  '/bootstrap-relays': typeof BootstrapRelaysRoute
  '/set-group': typeof SetGroupRoute
  '/set-interest': typeof SetInterestRoute
  '/new': typeof NewLazyRoute
  '/reset': typeof ResetLazyRoute
  '/columns': typeof ColumnsLayoutRouteWithChildren
  '/zap/$id': typeof ZapIdRoute
  '/auth/connect': typeof AuthConnectLazyRoute
  '/auth/import': typeof AuthImportLazyRoute
  '/auth/watch': typeof AuthWatchLazyRoute
  '/set-signer/$id': typeof SetSignerIdLazyRoute
  '/settings/$id': typeof SettingsIdLazyRouteWithChildren
  '/': typeof LayoutIndexRoute
  '/new-post': typeof NewPostIndexRoute
  '/columns/create-newsfeed': typeof ColumnsLayoutCreateNewsfeedRouteWithChildren
  '/columns/global': typeof ColumnsLayoutGlobalRoute
  '/settings/$id/bitcoin-connect': typeof SettingsIdBitcoinConnectRoute
  '/settings/$id/general': typeof SettingsIdGeneralRoute
  '/settings/$id/profile': typeof SettingsIdProfileRoute
  '/settings/$id/relay': typeof SettingsIdRelayRoute
  '/settings/$id/wallet': typeof SettingsIdWalletRoute
  '/columns/launchpad': typeof ColumnsLayoutLaunchpadLazyRoute
  '/columns/onboarding': typeof ColumnsLayoutOnboardingLazyRoute
  '/columns/search': typeof ColumnsLayoutSearchLazyRoute
  '/columns/trending': typeof ColumnsLayoutTrendingLazyRoute
  '/columns/create-newsfeed/f2f': typeof ColumnsLayoutCreateNewsfeedF2fRoute
  '/columns/create-newsfeed/users': typeof ColumnsLayoutCreateNewsfeedUsersRoute
  '/columns/groups/$id': typeof ColumnsLayoutGroupsIdRoute
  '/columns/interests/$id': typeof ColumnsLayoutInterestsIdRoute
  '/columns/newsfeed/$id': typeof ColumnsLayoutNewsfeedIdRoute
  '/columns/stories/$id': typeof ColumnsLayoutStoriesIdRoute
  '/columns/events/$id': typeof ColumnsLayoutEventsIdLazyRoute
  '/columns/notification/$id': typeof ColumnsLayoutNotificationIdLazyRoute
  '/columns/replies/$id': typeof ColumnsLayoutRepliesIdLazyRoute
  '/columns/users/$id': typeof ColumnsLayoutUsersIdLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/bootstrap-relays': typeof BootstrapRelaysRoute
  '/set-group': typeof SetGroupRoute
  '/set-interest': typeof SetInterestRoute
  '/new': typeof NewLazyRoute
  '/reset': typeof ResetLazyRoute
  '/columns': typeof ColumnsRouteWithChildren
  '/columns/_layout': typeof ColumnsLayoutRouteWithChildren
  '/zap/$id': typeof ZapIdRoute
  '/auth/connect': typeof AuthConnectLazyRoute
  '/auth/import': typeof AuthImportLazyRoute
  '/auth/watch': typeof AuthWatchLazyRoute
  '/set-signer/$id': typeof SetSignerIdLazyRoute
  '/settings/$id': typeof SettingsIdLazyRouteWithChildren
  '/_layout/': typeof LayoutIndexRoute
  '/new-post/': typeof NewPostIndexRoute
  '/columns/_layout/create-newsfeed': typeof ColumnsLayoutCreateNewsfeedRouteWithChildren
  '/columns/_layout/global': typeof ColumnsLayoutGlobalRoute
  '/settings/$id/bitcoin-connect': typeof SettingsIdBitcoinConnectRoute
  '/settings/$id/general': typeof SettingsIdGeneralRoute
  '/settings/$id/profile': typeof SettingsIdProfileRoute
  '/settings/$id/relay': typeof SettingsIdRelayRoute
  '/settings/$id/wallet': typeof SettingsIdWalletRoute
  '/columns/_layout/launchpad': typeof ColumnsLayoutLaunchpadLazyRoute
  '/columns/_layout/onboarding': typeof ColumnsLayoutOnboardingLazyRoute
  '/columns/_layout/search': typeof ColumnsLayoutSearchLazyRoute
  '/columns/_layout/trending': typeof ColumnsLayoutTrendingLazyRoute
  '/columns/_layout/create-newsfeed/f2f': typeof ColumnsLayoutCreateNewsfeedF2fRoute
  '/columns/_layout/create-newsfeed/users': typeof ColumnsLayoutCreateNewsfeedUsersRoute
  '/columns/_layout/groups/$id': typeof ColumnsLayoutGroupsIdRoute
  '/columns/_layout/interests/$id': typeof ColumnsLayoutInterestsIdRoute
  '/columns/_layout/newsfeed/$id': typeof ColumnsLayoutNewsfeedIdRoute
  '/columns/_layout/stories/$id': typeof ColumnsLayoutStoriesIdRoute
  '/columns/_layout/events/$id': typeof ColumnsLayoutEventsIdLazyRoute
  '/columns/_layout/notification/$id': typeof ColumnsLayoutNotificationIdLazyRoute
  '/columns/_layout/replies/$id': typeof ColumnsLayoutRepliesIdLazyRoute
  '/columns/_layout/users/$id': typeof ColumnsLayoutUsersIdLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/bootstrap-relays'
    | '/set-group'
    | '/set-interest'
    | '/new'
    | '/reset'
    | '/columns'
    | '/zap/$id'
    | '/auth/connect'
    | '/auth/import'
    | '/auth/watch'
    | '/set-signer/$id'
    | '/settings/$id'
    | '/'
    | '/new-post'
    | '/columns/create-newsfeed'
    | '/columns/global'
    | '/settings/$id/bitcoin-connect'
    | '/settings/$id/general'
    | '/settings/$id/profile'
    | '/settings/$id/relay'
    | '/settings/$id/wallet'
    | '/columns/launchpad'
    | '/columns/onboarding'
    | '/columns/search'
    | '/columns/trending'
    | '/columns/create-newsfeed/f2f'
    | '/columns/create-newsfeed/users'
    | '/columns/groups/$id'
    | '/columns/interests/$id'
    | '/columns/newsfeed/$id'
    | '/columns/stories/$id'
    | '/columns/events/$id'
    | '/columns/notification/$id'
    | '/columns/replies/$id'
    | '/columns/users/$id'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/bootstrap-relays'
    | '/set-group'
    | '/set-interest'
    | '/new'
    | '/reset'
    | '/columns'
    | '/zap/$id'
    | '/auth/connect'
    | '/auth/import'
    | '/auth/watch'
    | '/set-signer/$id'
    | '/settings/$id'
    | '/'
    | '/new-post'
    | '/columns/create-newsfeed'
    | '/columns/global'
    | '/settings/$id/bitcoin-connect'
    | '/settings/$id/general'
    | '/settings/$id/profile'
    | '/settings/$id/relay'
    | '/settings/$id/wallet'
    | '/columns/launchpad'
    | '/columns/onboarding'
    | '/columns/search'
    | '/columns/trending'
    | '/columns/create-newsfeed/f2f'
    | '/columns/create-newsfeed/users'
    | '/columns/groups/$id'
    | '/columns/interests/$id'
    | '/columns/newsfeed/$id'
    | '/columns/stories/$id'
    | '/columns/events/$id'
    | '/columns/notification/$id'
    | '/columns/replies/$id'
    | '/columns/users/$id'
  id:
    | '__root__'
    | '/_layout'
    | '/bootstrap-relays'
    | '/set-group'
    | '/set-interest'
    | '/new'
    | '/reset'
    | '/columns'
    | '/columns/_layout'
    | '/zap/$id'
    | '/auth/connect'
    | '/auth/import'
    | '/auth/watch'
    | '/set-signer/$id'
    | '/settings/$id'
    | '/_layout/'
    | '/new-post/'
    | '/columns/_layout/create-newsfeed'
    | '/columns/_layout/global'
    | '/settings/$id/bitcoin-connect'
    | '/settings/$id/general'
    | '/settings/$id/profile'
    | '/settings/$id/relay'
    | '/settings/$id/wallet'
    | '/columns/_layout/launchpad'
    | '/columns/_layout/onboarding'
    | '/columns/_layout/search'
    | '/columns/_layout/trending'
    | '/columns/_layout/create-newsfeed/f2f'
    | '/columns/_layout/create-newsfeed/users'
    | '/columns/_layout/groups/$id'
    | '/columns/_layout/interests/$id'
    | '/columns/_layout/newsfeed/$id'
    | '/columns/_layout/stories/$id'
    | '/columns/_layout/events/$id'
    | '/columns/_layout/notification/$id'
    | '/columns/_layout/replies/$id'
    | '/columns/_layout/users/$id'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
  BootstrapRelaysRoute: typeof BootstrapRelaysRoute
  SetGroupRoute: typeof SetGroupRoute
  SetInterestRoute: typeof SetInterestRoute
  NewLazyRoute: typeof NewLazyRoute
  ResetLazyRoute: typeof ResetLazyRoute
  ColumnsRoute: typeof ColumnsRouteWithChildren
  ZapIdRoute: typeof ZapIdRoute
  AuthConnectLazyRoute: typeof AuthConnectLazyRoute
  AuthImportLazyRoute: typeof AuthImportLazyRoute
  AuthWatchLazyRoute: typeof AuthWatchLazyRoute
  SetSignerIdLazyRoute: typeof SetSignerIdLazyRoute
  SettingsIdLazyRoute: typeof SettingsIdLazyRouteWithChildren
  NewPostIndexRoute: typeof NewPostIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  BootstrapRelaysRoute: BootstrapRelaysRoute,
  SetGroupRoute: SetGroupRoute,
  SetInterestRoute: SetInterestRoute,
  NewLazyRoute: NewLazyRoute,
  ResetLazyRoute: ResetLazyRoute,
  ColumnsRoute: ColumnsRouteWithChildren,
  ZapIdRoute: ZapIdRoute,
  AuthConnectLazyRoute: AuthConnectLazyRoute,
  AuthImportLazyRoute: AuthImportLazyRoute,
  AuthWatchLazyRoute: AuthWatchLazyRoute,
  SetSignerIdLazyRoute: SetSignerIdLazyRoute,
  SettingsIdLazyRoute: SettingsIdLazyRouteWithChildren,
  NewPostIndexRoute: NewPostIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/bootstrap-relays",
        "/set-group",
        "/set-interest",
        "/new",
        "/reset",
        "/columns",
        "/zap/$id",
        "/auth/connect",
        "/auth/import",
        "/auth/watch",
        "/set-signer/$id",
        "/settings/$id",
        "/new-post/"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/"
      ]
    },
    "/bootstrap-relays": {
      "filePath": "bootstrap-relays.tsx"
    },
    "/set-group": {
      "filePath": "set-group.tsx"
    },
    "/set-interest": {
      "filePath": "set-interest.tsx"
    },
    "/new": {
      "filePath": "new.lazy.tsx"
    },
    "/reset": {
      "filePath": "reset.lazy.tsx"
    },
    "/columns": {
      "filePath": "columns",
      "children": [
        "/columns/_layout"
      ]
    },
    "/columns/_layout": {
      "filePath": "columns/_layout.tsx",
      "parent": "/columns",
      "children": [
        "/columns/_layout/create-newsfeed",
        "/columns/_layout/global",
        "/columns/_layout/launchpad",
        "/columns/_layout/onboarding",
        "/columns/_layout/search",
        "/columns/_layout/trending",
        "/columns/_layout/groups/$id",
        "/columns/_layout/interests/$id",
        "/columns/_layout/newsfeed/$id",
        "/columns/_layout/stories/$id",
        "/columns/_layout/events/$id",
        "/columns/_layout/notification/$id",
        "/columns/_layout/replies/$id",
        "/columns/_layout/users/$id"
      ]
    },
    "/zap/$id": {
      "filePath": "zap.$id.tsx"
    },
    "/auth/connect": {
      "filePath": "auth/connect.lazy.tsx"
    },
    "/auth/import": {
      "filePath": "auth/import.lazy.tsx"
    },
    "/auth/watch": {
      "filePath": "auth/watch.lazy.tsx"
    },
    "/set-signer/$id": {
      "filePath": "set-signer.$id.lazy.tsx"
    },
    "/settings/$id": {
      "filePath": "settings.$id.lazy.tsx",
      "children": [
        "/settings/$id/bitcoin-connect",
        "/settings/$id/general",
        "/settings/$id/profile",
        "/settings/$id/relay",
        "/settings/$id/wallet"
      ]
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    },
    "/new-post/": {
      "filePath": "new-post/index.tsx"
    },
    "/columns/_layout/create-newsfeed": {
      "filePath": "columns/_layout/create-newsfeed.tsx",
      "parent": "/columns/_layout",
      "children": [
        "/columns/_layout/create-newsfeed/f2f",
        "/columns/_layout/create-newsfeed/users"
      ]
    },
    "/columns/_layout/global": {
      "filePath": "columns/_layout/global.tsx",
      "parent": "/columns/_layout"
    },
    "/settings/$id/bitcoin-connect": {
      "filePath": "settings.$id/bitcoin-connect.tsx",
      "parent": "/settings/$id"
    },
    "/settings/$id/general": {
      "filePath": "settings.$id/general.tsx",
      "parent": "/settings/$id"
    },
    "/settings/$id/profile": {
      "filePath": "settings.$id/profile.tsx",
      "parent": "/settings/$id"
    },
    "/settings/$id/relay": {
      "filePath": "settings.$id/relay.tsx",
      "parent": "/settings/$id"
    },
    "/settings/$id/wallet": {
      "filePath": "settings.$id/wallet.tsx",
      "parent": "/settings/$id"
    },
    "/columns/_layout/launchpad": {
      "filePath": "columns/_layout/launchpad.lazy.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/onboarding": {
      "filePath": "columns/_layout/onboarding.lazy.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/search": {
      "filePath": "columns/_layout/search.lazy.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/trending": {
      "filePath": "columns/_layout/trending.lazy.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/create-newsfeed/f2f": {
      "filePath": "columns/_layout/create-newsfeed.f2f.tsx",
      "parent": "/columns/_layout/create-newsfeed"
    },
    "/columns/_layout/create-newsfeed/users": {
      "filePath": "columns/_layout/create-newsfeed.users.tsx",
      "parent": "/columns/_layout/create-newsfeed"
    },
    "/columns/_layout/groups/$id": {
      "filePath": "columns/_layout/groups.$id.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/interests/$id": {
      "filePath": "columns/_layout/interests.$id.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/newsfeed/$id": {
      "filePath": "columns/_layout/newsfeed.$id.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/stories/$id": {
      "filePath": "columns/_layout/stories.$id.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/events/$id": {
      "filePath": "columns/_layout/events.$id.lazy.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/notification/$id": {
      "filePath": "columns/_layout/notification.$id.lazy.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/replies/$id": {
      "filePath": "columns/_layout/replies.$id.lazy.tsx",
      "parent": "/columns/_layout"
    },
    "/columns/_layout/users/$id": {
      "filePath": "columns/_layout/users.$id.lazy.tsx",
      "parent": "/columns/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
