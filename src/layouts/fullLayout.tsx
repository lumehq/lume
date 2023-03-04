export default function FullLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-radial-page relative h-full overflow-hidden">
      {/* dragging area */}
      <div data-tauri-drag-region className="absolute top-0 left-0 z-20 h-16 w-full bg-transparent" />
      {/* end dragging area */}
      {/* content */}
      <div className="relative z-10 h-full">{children}</div>
      {/* end content */}
    </div>
  );
}
