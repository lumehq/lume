import { DEFAULT_AVATAR } from '@stores/constants';

import Image from 'next/image';
import { memo, useEffect, useState } from 'react';

export const ImageWithFallback = memo(function ImageWithFallback({
  src,
  alt,
  fill,
  className,
}: {
  src: string;
  alt: string;
  fill: boolean;
  className: string;
}) {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image src={error ? DEFAULT_AVATAR : src} alt={alt} fill={fill} className={className} onError={setError} priority />
  );
});
