export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen w-screen bg-white text-zinc-900 dark:bg-near-black  dark:text-white">{children}</div>;
}
