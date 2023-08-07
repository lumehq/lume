import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createBlock, getBlocks, removeBlock } from '@libs/storage';

import { Block } from '@utils/types';

interface BlockState {
  blocks: null | Array<Block>;
  fetchBlocks: () => void;
  setBlock: ({ kind, title, content }: Block) => void;
  removeBlock: (id: string) => void;
}

export const useBlocks = create<BlockState>()(
  persist(
    (set) => ({
      blocks: null,
      fetchBlocks: async () => {
        const blocks = await getBlocks();
        set({ blocks: blocks });
      },
      setBlock: async ({ kind, title, content }: Block) => {
        const block: Block = await createBlock(kind, title, content);
        set((state) => ({ blocks: [...state.blocks, block] }));
      },
      removeBlock: async (id: string) => {
        await removeBlock(id);
        set((state) => ({ blocks: state.blocks.filter((block) => block.id !== id) }));
      },
    }),
    {
      name: 'blocks',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
