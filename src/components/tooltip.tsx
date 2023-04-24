export default function Tooltip({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <div className="group relative flex">
      {children}
      <span className="absolute top-10 scale-0 rounded bg-zinc-800 p-2 text-xs text-zinc-100 transition-all group-hover:scale-100">
        {message}
      </span>
    </div>
  );
}
