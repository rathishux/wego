import type * as React from "react";

type LogoMarkProps = React.SVGProps<SVGSVGElement>;

/** The "NY" monogram mark. Renders in the current text color. */
export function LogoMark({ className, ...props }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 501 502" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M94.6106 4.46313H5.6272V488.813H94.6106V4.46313Z" fill="currentColor" />
      <path d="M460.036 4.46313H371.052V488.813H460.036V4.46313Z" fill="currentColor" />
      <path
        d="M246.749 4.46316L177.662 60.5757L460.036 338.047L460.036 256.135L246.749 4.46316Z"
        fill="currentColor"
      />
      <path d="M276.35 490H365.12L94.2364 4.46313H8L276.35 490Z" fill="currentColor" />
    </svg>
  );
}
