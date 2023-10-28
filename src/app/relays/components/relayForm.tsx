import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import { PlusIcon } from '@shared/icons';

const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

export function RelayForm() {
  const { db } = useStorage();
  const queryClient = useQueryClient();

  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const createRelay = async () => {
    if (url.length < 1) return setError('Please enter relay url');
    try {
      const relay = new URL(url.replace(/\s/g, ''));
      if (
        domainRegex.test(relay.host) &&
        (relay.protocol === 'wss:' || relay.protocol === 'ws:')
      ) {
        const res = await db.createRelay(url);
        if (!res) return setError("You're already using this relay");

        queryClient.invalidateQueries({
          queryKey: ['user-relay'],
        });

        setError('');
        setUrl('');
      } else {
        return setError(
          'URL is invalid, a relay must use websocket protocol (start with wss:// or ws://). Please check again'
        );
      }
    } catch {
      return setError('Relay URL is not valid. Please check again');
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-10 items-center justify-between rounded-lg bg-neutral-200 pr-1.5 dark:bg-neutral-800">
        <input
          className="h-full w-full bg-transparent pl-3 pr-1.5 text-neutral-900 placeholder:text-neutral-600 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-400"
          type="url"
          placeholder="wss://"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="button"
          onClick={() => createRelay()}
          className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <span className="text-sm text-red-400">{error}</span>
    </div>
  );
}
