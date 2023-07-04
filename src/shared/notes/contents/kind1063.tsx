import { NDKTag } from '@nostr-dev-kit/ndk';

import { Image } from '@shared/image';

function isImage(url: string) {
  return /\.(jpg|jpeg|gif|png|webp|avif)$/.test(url);
}

export function Kind1063({ metadata }: { metadata: NDKTag[] }) {
  const url = metadata[0][1];

  return (
    <div className="mt-3">
      {isImage(url) && (
        <Image
          src={url}
          fallback="https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW"
          alt="image"
          className="h-auto w-full rounded-lg object-cover"
        />
      )}
    </div>
  );
}
