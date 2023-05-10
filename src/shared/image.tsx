import { DEFAULT_AVATAR } from '@stores/constants';

export function Image(props) {
  const addImageFallback = (event) => {
    event.currentTarget.src = DEFAULT_AVATAR;
  };

  return (
    <img {...props} loading="lazy" decoding="async" onError={addImageFallback} style={{ contentVisibility: 'auto' }} />
  );
}
