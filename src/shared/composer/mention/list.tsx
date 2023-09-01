import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { type SuggestionProps } from '@tiptap/suggestion';
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

import { MentionItem } from '@shared/composer';

export const MentionList = forwardRef(
  (props: SuggestionProps, ref: ForwardedRef<unknown>) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index) => {
      const item = props.items[index];

      if (item) {
        props.command({ id: item });
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="flex w-[250px] flex-col rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
        {props.items.length ? (
          props.items.map((item: NDKUserProfile, index: number) => (
            <button
              className={twMerge(
                'h-11 w-full rounded-lg px-2 text-start text-sm font-medium hover:bg-white/10',
                `${index === selectedIndex ? 'is-selected' : ''}`
              )}
              key={index}
              onClick={() => selectItem(index)}
            >
              <MentionItem profile={item} />
            </button>
          ))
        ) : (
          <div>No result</div>
        )}
      </div>
    );
  }
);

MentionList.displayName = 'MentionList';
