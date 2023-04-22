import '@renderer/index.css';
import { Shell } from '@renderer/shell';
import { PageContextClient } from '@renderer/types';

import { hydrateRoot } from 'react-dom/client';

export const clientRouting = true;

export async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;

  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined');

  hydrateRoot(
    document.getElementById('app')!,
    <Shell pageContext={pageContext}>
      <Page {...pageProps} />
    </Shell>
  );
}
