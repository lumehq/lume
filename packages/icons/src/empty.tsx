import { SVGProps } from 'react';

export function EmptyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      fill="none"
      viewBox="0 0 120 120"
      {...props}
    >
      <g clipPath="url(#clip0_110_63)">
        <path
          fill="#27272A"
          fillRule="evenodd"
          d="M60 120c33.137 0 60-26.863 60-60S93.137 0 60 0C45.133 0 39.482 17.832 29 26.787 16.119 37.792 0 41.73 0 60c0 33.137 26.863 60 60 60z"
          clipRule="evenodd"
        />
        <g filter="url(#filter0_f_110_63)">
          <path
            fill="#18181B"
            fillRule="evenodd"
            d="M64 101c19.33 0 35-13.208 35-29.5S83.33 42 64 42c-8.672 0-11.969 8.767-18.083 13.17C38.403 60.58 29 62.517 29 71.5 29 87.792 44.67 101 64 101z"
            clipRule="evenodd"
          />
        </g>
        <path
          fill="#3F3F46"
          fillRule="evenodd"
          d="M82.941 59H65.06C59.504 59 55 63.476 55 68.997v4.871c0 5.521 4.504 9.997 10.059 9.997h18.879l5.779 4.685a2.02 2.02 0 002.83-.286c.293-.356.453-.803.453-1.263V68.997C93 63.476 88.496 59 82.941 59z"
          clipRule="evenodd"
        />
        <path
          fill="#D4D4D8"
          fillRule="evenodd"
          d="M41.161 39h32.678C81.659 39 88 45.408 88 53.314v12.864c0 7.905-6.34 14.314-14.161 14.314H41.547l-9.186 7.742a3.244 3.244 0 01-4.603-.422A3.325 3.325 0 0127 85.697V53.314C27 45.408 33.34 39 41.161 39z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_110_63"
          width="92"
          height="81"
          x="18"
          y="31"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_110_63" stdDeviation="5.5" />
        </filter>
        <clipPath id="clip0_110_63">
          <path fill="#fff" d="M0 0H120V120H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
