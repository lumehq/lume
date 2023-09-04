import ReactPlayer from 'react-player/es6';

export function VideoPreview({ urls }: { urls: string[] }) {
  return (
    <div className="relative mt-3 flex w-full flex-col gap-2">
      {urls.map((url) => (
        <ReactPlayer
          key={url}
          url={url}
          width="100%"
          height="auto"
          className="!h-auto overflow-hidden rounded-lg object-fill"
          controls={true}
          pip={true}
        />
      ))}
    </div>
  );
}
