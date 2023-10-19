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
        'w-min h-9 px-4 bg-neutral-400 dark:bg-neutral-600 rounded-md text-sm font-medium text-white hover:bg-blue-600';
      break;
    case 'publish':
      preClass =
        'w-min h-9 px-4 bg-blue-500 rounded-md text-sm font-medium text-white hover:bg-blue-600';
      break;
    case 'large':
      preClass =
        'h-11 w-full bg-blue-500 rounded-lg font-medium text-white hover:bg-blue-600';
      break;
    case 'large-alt':
      preClass =
        'h-11 w-full bg-neutral-400 dark:bg-neutral-600 rounded-lg font-medium text-white hover:bg-white/20';
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
