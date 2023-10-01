import { Suspense } from 'react';
import { Await, useLoaderData, useNavigate, useParams } from 'react-router-dom';

import { ArrowLeftIcon, LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

import { RelayEventList } from './components/relayEventList';

export function RelayScreen() {
  const { url } = useParams();

  const data: { relay?: { [key: string]: string } } = useLoaderData();
  const navigate = useNavigate();

  const getSoftwareName = (url: string) => {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return filename.replace('.git', '');
  };

  const titleCase = (s: string) => {
    return s
      .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
      .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());
  };

  return (
    <div className="grid h-full w-full grid-cols-3">
      <div className="col-span-2 border-r border-white/5">
        <div className="inline-flex h-16 w-full items-center gap-2.5 border-b border-white/5 px-3">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="h-5 w-5 text-white/70 hover:text-white" />
          </button>
          <h3 className="font-semibold text-white">Global events</h3>
        </div>
        <RelayEventList relayUrl={url} />
      </div>
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
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="font-semibold leading-tight text-white">
                      {resolvedRelay.name}
                    </h3>
                    <p className="text-sm font-medium text-white/70">
                      {resolvedRelay.description}
                    </p>
                  </div>
                  {resolvedRelay.pubkey ? (
                    <div className="flex flex-col gap-1">
                      <h5 className="text-sm font-semibold text-white/70">Owner:</h5>
                      <div className="w-full rounded-lg bg-white/10 px-2 py-2">
                        <User pubkey={resolvedRelay.pubkey} variant="simple" />
                      </div>
                    </div>
                  ) : null}
                  {resolvedRelay.contact ? (
                    <div>
                      <h5 className="text-sm font-semibold text-white/70">Contact:</h5>
                      <a
                        href={`mailto:${resolvedRelay.contact}`}
                        target="_blank"
                        className="underline after:content-['_↗'] hover:text-fuchsia-500"
                        rel="noreferrer"
                      >
                        mailto:{resolvedRelay.contact}
                      </a>
                    </div>
                  ) : null}
                  <div>
                    <h5 className="text-sm font-semibold text-white/70">Software:</h5>
                    <a
                      href={resolvedRelay.software}
                      target="_blank"
                      rel="noreferrer"
                      className="underline after:content-['_↗'] hover:text-fuchsia-500"
                    >
                      {getSoftwareName(resolvedRelay.software) +
                        ' - ' +
                        resolvedRelay.version}
                    </a>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white/70">
                      Supported NIPs:
                    </h5>
                    <div className="mt-2 grid grid-cols-7 gap-2">
                      {resolvedRelay.supported_nips.map((item: string) => (
                        <a
                          key={item}
                          href={`https://nips.be/${item}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex aspect-square h-full w-full items-center justify-center rounded-lg bg-white/10 text-sm font-medium hover:bg-fuchsia-500"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                  {resolvedRelay.limitation ? (
                    <div>
                      <h5 className="text-sm font-semibold text-white/70">Limitation</h5>
                      <div className="flex flex-col gap-2 divide-y divide-white/5">
                        {Object.keys(resolvedRelay.limitation).map((key, index) => {
                          return (
                            <div
                              key={index}
                              className="flex items-baseline justify-between pt-2"
                            >
                              <p className="text-sm font-medium text-white">
                                {titleCase(key)}:
                              </p>
                              <p className="text-sm font-medium text-white/70">
                                {resolvedRelay.limitation[key].toString()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                  {resolvedRelay.payments_url ? (
                    <div className="flex flex-col gap-1">
                      <a
                        href={resolvedRelay.payments_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-fuchsia-500 text-sm font-medium hover:bg-fuchsia-600"
                      >
                        Open payment website
                      </a>
                      <span className="text-center text-xs text-white/70">
                        You need to make a payment to connect this relay
                      </span>
                    </div>
                  ) : null}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
