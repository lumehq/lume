import { CreateViewModal } from '@lume/app/daily/components/views/createModal';

export const Header = () => {
  return (
    <div className="flex w-full gap-4">
      <button className="from-zinc-90 inline-flex h-11 items-center overflow-hidden border-b border-fuchsia-500 hover:bg-zinc-900">
        <span className="px-2 text-sm font-semibold text-zinc-300">Following</span>
      </button>
      <CreateViewModal />
    </div>
  );
};
