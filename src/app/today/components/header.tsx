import { CreateViewModal } from '@app/today/components/views/createModal';

export function Header() {
  return (
    <div className="flex w-full gap-4">
      <button className="from-zinc-90 inline-flex h-11 items-center overflow-hidden border-b border-fuchsia-500 hover:bg-zinc-900">
        <span className="px-2 text-sm font-semibold text-zinc-300">Following</span>
      </button>
      <div className="flex h-11 items-center -space-x-1 overflow-hidden">
        <img className="inline-block h-6 w-6 rounded ring-2 ring-zinc-950" src="https://133332.xyz/p.jpg" alt="" />
        <img
          className="inline-block h-6 w-6 rounded ring-2 ring-zinc-950"
          src="https://void.cat/d/3Bp6jSHURFNQ9u3pK8nwtq.webp"
          alt=""
        />
        <img
          className="inline-block h-6 w-6 rounded ring-2 ring-zinc-950"
          src="https://void.cat/d/8zE9T8a39YfUVjrLM4xcpE.webp"
          alt=""
        />
        <img
          className="ring-zinc-95 ring-20 inline-block h-6 w-6 rounded"
          src="https://nostr.build/i/p/nostr.build_0e412058980ed2ac4adf3de639304c9e970e2745ba9ca19c75f984f4f6da4971.jpeg"
          alt=""
        />
        <img
          className="ring-zinc-95 ring-20 inline-block h-6 w-6 rounded"
          src="https://davidcoen.it/wp-content/uploads/2020/11/7004972-taglio.jpg"
          alt=""
        />
      </div>
      <div className="flex h-11 items-center overflow-hidden">
        <img
          className="ring-zinc-95 ring-20 inline-block h-6 w-6 rounded"
          src="https://void.cat/d/KvAEMvYNmy1rfCH6a7HZzh.webp"
          alt=""
        />
      </div>
      <div className="flex h-11 items-center overflow-hidden">
        <img className="ring-zinc-95 ring-20 inline-block h-6 w-6 rounded" src="http://nostr.build/i/6369.jpg" alt="" />
      </div>
      <CreateViewModal />
    </div>
  );
}
