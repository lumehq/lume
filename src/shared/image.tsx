import { minidenticon } from 'minidenticons';
import { ImgHTMLAttributes, useState } from 'react';
import { useMemo } from 'react';

export function Image({ src, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [isError, setIsError] = useState(false);

  if (isError || !src) {
    const svgURI = useMemo(
      () =>
        'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(props.alt, 90, 50)),
      [props.alt]
    );
    return (
      <img src={svgURI} alt={props.alt} {...props} style={{ backgroundColor: '#000' }} />
    );
  }

  return (
    <img
      {...props}
      src={src}
      onError={() => {
        setIsError(true);
      }}
      decoding="async"
      alt="lume default img"
      style={{ contentVisibility: 'auto' }}
    />
  );
}
