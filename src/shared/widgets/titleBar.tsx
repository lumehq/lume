import { useState } from 'react';

import { useArk } from '@libs/ark';

import { CancelIcon, EditIcon, EnterIcon } from '@shared/icons';
import { User } from '@shared/user';

import { cropText } from '@utils/formater';
import { useWidget } from '@utils/hooks/useWidget';

export function TitleBar({
  id,
  title: aTitle,
  isLive,
}: {
  id?: string;
  title?: string;
  isLive?: boolean;
}) {
  const { ark } = useArk();

  const [title, setTitle] = useState(aTitle);
  const [editing, setEditing] = useState(false);
  const { removeWidget, renameWidget } = useWidget();

  const submitTitleChange = () => {
    renameWidget.mutate({ id, title });
    setEditing(false);
  };

  return (
    <div className="grid h-11 w-full shrink-0 grid-cols-3 items-center px-3">
      <div className="col-span-1 flex justify-start">
        {isLive ? (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
            </span>
            <p className="text-xs font-medium text-teal-500">Live</p>
          </div>
        ) : null}
      </div>
      <div className="col-span-1 flex justify-center">
        {id === '9999' ? (
          <div className="isolate flex -space-x-2">
            {ark.account.contacts
              ?.slice(0, 8)
              .map((item) => <User key={item} pubkey={item} variant="ministacked" />)}
            {ark.account.contacts?.length > 8 ? (
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-300 text-neutral-900 ring-1 ring-white dark:bg-neutral-700 dark:text-neutral-100 dark:ring-black">
                <span className="text-[8px] font-medium">
                  +{ark.account.contacts?.length - 8}
                </span>
              </div>
            ) : null}
          </div>
        ) : !editing ? (
          <h3
            title={title}
            className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {cropText(title)}
          </h3>
        ) : (
          <input
            onChange={(e) => setTitle(e.target.value)}
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                submitTitleChange();
              }
              if (event.key === 'Escape') {
                setTitle(aTitle);
                setEditing(false);
              }
            }}
            type="text"
            spellCheck={false}
            autoFocus={editing}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="type here..."
            value={title}
            className="dark:transparent max-h-6 border-transparent bg-transparent px-3 text-sm placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
          ></input>
        )}
      </div>
      {id !== '9999' && id !== '9998' ? (
        <div className="col-span-1 flex justify-end">
          <button
            type="button"
            onClick={() => (editing ? submitTitleChange() : setEditing(true))}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-900 backdrop-blur-xl hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            {editing ? (
              <EnterIcon className="h-3 w-3" />
            ) : (
              <EditIcon className="h-3 w-3" />
            )}
          </button>
          <button
            type="button"
            onClick={() => removeWidget.mutate(id)}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-900 backdrop-blur-xl hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            <CancelIcon className="h-3 w-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
