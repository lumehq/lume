import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Resources } from '@utils/types';

const DEFAULT_RESOURCES: Array<Resources> = [
  {
    title: 'The Basics (provide by nostr.com)',
    data: [
      {
        id: 'naddr1qqxnzd3exsurgwfnxgcnjve5qgsym7p8qvs805ny3z3vausedzzwnwk27cfe67r69nrxpqe8w0urmegrqsqqqa283wgxe0',
        title: 'What is Nostr?',
        image: '',
      },
      {
        id: 'naddr1qqxnzd3exsurgwf48qcnvdfcqgsym7p8qvs805ny3z3vausedzzwnwk27cfe67r69nrxpqe8w0urmegrqsqqqa28cnv0yt',
        title: 'Understanding keys',
        image: '',
      },
      {
        id: 'naddr1qqxnzd3exsurgwfcxgcrzwfjqgsym7p8qvs805ny3z3vausedzzwnwk27cfe67r69nrxpqe8w0urmegrqsqqqa28uccw5e',
        title: "What's a client?",
        image: '',
      },
      {
        id: 'naddr1qqxnzd3exsurgwfexqersdp5qgsym7p8qvs805ny3z3vausedzzwnwk27cfe67r69nrxpqe8w0urmegrqsqqqa28jvlesq',
        title: 'What are relays?',
        image: '',
      },
      {
        id: 'naddr1qqxnzd3exsur2vpjxserjveeqgsym7p8qvs805ny3z3vausedzzwnwk27cfe67r69nrxpqe8w0urmegrqsqqqa28rqy7mx',
        title: 'What is an event?',
        image: '',
      },
      {
        id: 'naddr1qqxnzd3exsur2vp5xsmnywpnqgsym7p8qvs805ny3z3vausedzzwnwk27cfe67r69nrxpqe8w0urmegrqsqqqa28hxwx4e',
        title: 'How to help Nostr?',
        image: '',
      },
    ],
  },
  {
    title: 'Lume Tutorials',
    data: [],
  },
];

interface ResourceState {
  resources: Array<Resources>;
  readed: Set<string>;
  readResource: (id: string) => void;
}

export const useResources = create<ResourceState>()(
  persist(
    (set) => ({
      resources: DEFAULT_RESOURCES,
      readed: new Set(),
      readResource: (id: string) => {
        set((state) => ({ readed: new Set(state.readed).add(id) }));
      },
    }),
    {
      name: 'resources',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
