import { minidenticon } from 'minidenticons';
import { ImgHTMLAttributes, memo, useState } from 'react';

export const Image = memo(function Image({
  src,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [isError, setIsError] = useState(false);

  if (isError || !src) {
    const svgURI =
      'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(props.alt, 90, 50));
    return (
      <img src={svgURI} alt={props.alt} {...props} style={{ backgroundColor: '#000' }} />
    );
  }

  return (
    <img
      {...props}
      src={src}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        setIsError(true);
      }}
      loading="lazy"
      decoding="async"
      alt="lume default img"
      style={{ contentVisibility: 'auto' }}
    />
  );
});
