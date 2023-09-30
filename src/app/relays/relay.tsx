import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { LoaderIcon } from '@shared/icons';

export function RelayScreen() {
  const data: { relay?: { [key: string]: string } } = useLoaderData();

  return (
    <div className="grid h-full w-full grid-cols-3">
      <div className="col-span-2 border-r border-white/5"></div>
      <div className="col-span-1">
        <div className="inline-flex h-16 w-full items-center border-b border-white/5 px-3">
          <h3 className="font-semibold text-white">Information</h3>
        </div>
        <div className="mt-4 px-3">
          <Suspense
            fallback={
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <LoaderIcon className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            }
          >
            <Await
              resolve={data.relay}
              errorElement={
                <div className="text-sm font-medium">
                  <p>Could not load relay information 😬</p>
                </div>
              }
            >
              {(resolvedRelay) => (
                <div className="flex flex-col gap-2">
                  <p>
                    <span className="font-semibold">Name</span> : {resolvedRelay.name}
                  </p>
                  <p>
                    <span className="font-semibold">Description</span> :{' '}
                    {resolvedRelay.description}
                  </p>
                  <p>
                    <span className="font-semibold">Contact</span> :{' '}
                    {resolvedRelay.contact}
                  </p>
                  <p>
                    <span className="font-semibold">Software</span> : [open website]
                  </p>
                  <p>
                    <span className="font-semibold">Version</span> :{' '}
                    {resolvedRelay.version}
                  </p>
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
