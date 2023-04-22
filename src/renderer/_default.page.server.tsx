import { Shell } from '@renderer/shell';
import { PageContextServer } from '@renderer/types';

import ReactDOMServer from 'react-dom/server';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr/server';

export const passToClient = ['pageProps'];

export function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;

  if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined');

  const pageHtml = ReactDOMServer.renderToString(
    <Shell pageContext={pageContext}>
      <Page {...pageProps} />
    </Shell>
  );

  return escapeInject`<!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body class="cursor-default select-none overflow-hidden font-sans antialiased">
        <div id="app">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
