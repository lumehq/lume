import { Outlet } from 'react-router-dom';

export function NoteLayout() {
  return (
    <div className="relative h-screen w-screen bg-black/90">
      <div className="absolute left-0 top-0 z-50 h-16 w-full" data-tauri-drag-region />
      <Outlet />
    </div>
  );
}
