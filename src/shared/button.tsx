import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function Button({
  preset,
  children,
  disabled = false,
  onClick = undefined,
}: {
  preset: 'small' | 'publish' | 'large' | 'large-alt';
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  let preClass: string;
  switch (preset) {
    case 'small':
      preClass =
        'w-min h-9 px-4 bg-white/10 backdrop-blur-xl rounded-md text-sm font-medium text-white hover:bg-fuchsia-500';
      break;
    case 'publish':
      preClass =
        'w-min h-9 px-4 bg-fuchsia-500 rounded-md text-sm font-medium text-white hover:bg-fuchsia-600';
      break;
    case 'large':
      preClass =
        'h-11 w-full bg-fuchsia-500 rounded-lg font-medium text-white hover:bg-fuchsia-600';
      break;
    case 'large-alt':
      preClass =
        'h-11 w-full bg-white/10 backdrop-blur-xl rounded-lg font-medium text-white hover:bg-white/20';
      break;
    default:
      break;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        'inline-flex transform items-center justify-center gap-1 leading-none focus:outline-none active:translate-y-1 disabled:pointer-events-none disabled:opacity-50',
        preClass
      )}
    >
      {children}
    </button>
  );
}
