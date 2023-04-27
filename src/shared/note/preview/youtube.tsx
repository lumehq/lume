import YouTube from 'react-youtube';

function getVideoId(url: string) {
  const regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  return regex.exec(url)[3];
}

export const YoutubePreview = ({ url }: { url: string }) => {
  const id = getVideoId(url);

  return (
    <div onClick={(e) => e.stopPropagation()} className="relative mt-2 flex flex-col overflow-hidden rounded-lg">
      <YouTube videoId={id} className="aspect-video xl:w-2/3" opts={{ width: '100%', height: '100%' }} />
    </div>
  );
};
