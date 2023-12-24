import { MentionOptions } from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { MentionList } from '@app/new/components';
import { useStorage } from '@libs/ark';

export function useSuggestion() {
  const storage = useStorage();

  const suggestion: MentionOptions['suggestion'] = {
    items: async ({ query }) => {
      const users = await storage.getAllCacheUsers();
      return users
        .filter((item) => {
          if (item.name) return item.name.toLowerCase().startsWith(query.toLowerCase());
          return item.displayName.toLowerCase().startsWith(query.toLowerCase());
        })
        .slice(0, 5);
    },
    render: () => {
      let component;
      let popup;

      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup[0].hide();

            return true;
          }

          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };

  return { suggestion };
}
