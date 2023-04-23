import '@renderer/index.css';
import { Shell } from '@renderer/shell';
import { PageContextClient } from '@renderer/types';

import { Root, createRoot, hydrateRoot } from 'react-dom/client';

export const clientRouting = true;
let root: Root;

export async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;

  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined');

  const page = (
    <Shell pageContext={pageContext}>
      <Page {...pageProps} />
    </Shell>
  );

  const container = document.getElementById('app');
  // SPA
  if (container.innerHTML === '' || !pageContext.isHydration) {
    if (!root) {
      root = createRoot(container);
    }
    root.render(page);
    // SSR
  } else {
    root = hydrateRoot(container, page);
  }
}
