import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="cursor-default select-none overflow-hidden font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
