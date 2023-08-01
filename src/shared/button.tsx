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
        'w-min h-9 px-4 bg-white/10 rounded-md text-sm font-medium text-white hover:bg-fuchsia-500';
      break;
    case 'publish':
      preClass =
        'w-min h-9 px-4 bg-fuchsia-500 rounded-md text-sm font-medium text-zinc-100 hover:bg-fuchsia-600';
      break;
    case 'large':
      preClass =
        'h-11 w-full bg-fuchsia-500 rounded-md font-medium text-zinc-100 hover:bg-fuchsia-600';
      break;
    case 'large-alt':
      preClass =
        'h-11 w-full bg-zinc-800 rounded-md font-medium text-zinc-300 border-t border-zinc-700/50 hover:bg-zinc-900';
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
        'inline-flex transform items-center justify-center gap-1 focus:outline-none active:translate-y-1 disabled:pointer-events-none disabled:opacity-50',
        preClass
      )}
    >
      {children}
    </button>
  );
}
