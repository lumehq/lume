import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

export function RelayScreen() {
  const data: { relay?: { [key: string]: string } } = useLoaderData();

  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Await
          resolve={data.relay}
          errorElement={<div>Could not load relay information 😬</div>}
        >
          {(resolvedRelay) => <p>{JSON.stringify(resolvedRelay)}</p>}
        </Await>
      </Suspense>
    </div>
  );
}
