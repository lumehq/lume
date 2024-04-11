export function VideoPreview({ url }: { url: string }) {
  return (
    <div className="my-1 overflow-hidden rounded-xl">
      <video
        className="h-auto w-full bg-neutral-100 text-sm dark:bg-neutral-900"
        controls
        muted
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
