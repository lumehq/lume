import { useState } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { PostEditor } from '@app/notes/components';

import { ArrowLeftIcon } from '@shared/icons';

export function NewNoteScreen() {
  const [type, setType] = useState<'post' | 'article' | 'file' | 'raw'>('post');

  return (
    <div className="h-full w-full pt-4">
      <div className="container mx-auto grid grid-cols-8 px-4">
        <div className="col-span-1">
          <Link
            to="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </div>
        <div className="col-span-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 items-center gap-2 rounded-lg bg-neutral-100 px-0.5 dark:bg-neutral-800">
              <button
                type="button"
                onClick={() => setType('post')}
                className={twMerge(
                  'inline-flex h-9 w-20 items-center justify-center rounded-lg text-sm font-medium',
                  type === 'post' ? 'bg-white shadow' : 'bg-transparent'
                )}
              >
                Post
              </button>
              <button
                type="button"
                onClick={() => setType('article')}
                className={twMerge(
                  'inline-flex h-9 w-20 items-center justify-center rounded-lg text-sm font-medium',
                  type === 'article' ? 'bg-white shadow' : 'bg-transparent'
                )}
              >
                Article
              </button>
              <button
                type="button"
                onClick={() => setType('file')}
                className={twMerge(
                  'inline-flex h-9 w-20 items-center justify-center rounded-lg text-sm font-medium',
                  type === 'file' ? 'bg-white shadow' : 'bg-transparent'
                )}
              >
                File
              </button>
              <button
                type="button"
                onClick={() => setType('raw')}
                className={twMerge(
                  'inline-flex h-9 w-20 items-center justify-center rounded-lg text-sm font-medium',
                  type === 'file' ? 'bg-white shadow' : 'bg-transparent'
                )}
              >
                Raw (advance)
              </button>
            </div>
          </div>
          {type === 'post' ? <PostEditor /> : null}
        </div>
        <div className="col-span-1" />
      </div>
    </div>
  );
}
