import { Image } from '@lume/shared/image';
import { DEFAULT_AVATAR, IMGPROXY_URL } from '@lume/stores/constants';

export function User({ data }: { data: any }) {
  const metadata = JSON.parse(data.metadata);

  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-zinc-900">
        <Image
          src={`${IMGPROXY_URL}/rs:fit:100:100/plain/${metadata?.picture ? metadata.picture : DEFAULT_AVATAR}`}
          alt={data.pubkey}
          className="h-8 w-8 object-cover"
          loading="auto"
        />
      </div>
      <h5 className="text-sm font-semibold leading-none text-zinc-100">
        {metadata?.display_name || metadata?.name || (
          <div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-700"></div>
        )}
      </h5>
    </div>
  );
}
