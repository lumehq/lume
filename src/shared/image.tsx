import { ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<any> {
  fallback: string;
}

export function Image({ src, fallback, ...props }: Props) {
  return (
    <img
      {...props}
      src={src || fallback}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = fallback;
      }}
      decoding="async"
      alt="lume default img"
      style={{ contentVisibility: 'auto' }}
    />
  );
}
