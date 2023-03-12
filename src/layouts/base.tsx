export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">{children}</div>;
}
