import Navigation from '@components/navigation';

export default function CreateChannelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid w-full grid-cols-4">
      <div className="scrollbar-hide col-span-1 overflow-y-auto overflow-x-hidden border-r border-zinc-900">
        <Navigation />
      </div>
      <div className="col-span-3 m-3 overflow-hidden xl:mr-1.5">
        <div className="h-full w-full rounded-lg">{children}</div>
      </div>
    </div>
  );
}
