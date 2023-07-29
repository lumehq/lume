import { FetchOptions, ResponseType, fetch } from '@tauri-apps/plugin-http';
import * as cheerio from 'cheerio';

import { OPENGRAPH } from '@stores/constants';

interface ILinkPreviewOptions {
  headers?: Record<string, string>;
  imagesPropertyType?: string;
  proxyUrl?: string;
  timeout?: number;
  followRedirects?: `follow` | `error` | `manual`;
  resolveDNSHost?: (url: string) => Promise<string>;
  handleRedirects?: (baseURL: string, forwardedURL: string) => boolean;
}

interface IPreFetchedResource {
  headers: Record<string, string>;
  status?: number;
  imagesPropertyType?: string;
  proxyUrl?: string;
  url: string;
  data: any;
}

function metaTag(doc: cheerio.CheerioAPI, type: string, attr: string) {
  const nodes = doc(`meta[${attr}='${type}']`);
  return nodes.length ? nodes : null;
}

function metaTagContent(doc: cheerio.CheerioAPI, type: string, attr: string) {
  return doc(`meta[${attr}='${type}']`).attr('content');
}

function getTitle(doc: cheerio.CheerioAPI) {
  let title =
    metaTagContent(doc, 'og:title', 'property') ||
    metaTagContent(doc, 'og:title', 'name');
  if (!title) {
    title = doc('title').text();
  }
  return title;
}

function getSiteName(doc: cheerio.CheerioAPI) {
  const siteName =
    metaTagContent(doc, 'og:site_name', 'property') ||
    metaTagContent(doc, 'og:site_name', 'name');
  return siteName;
}

function getDescription(doc: cheerio.CheerioAPI) {
  const description =
    metaTagContent(doc, 'description', 'name') ||
    metaTagContent(doc, 'Description', 'name') ||
    metaTagContent(doc, 'og:description', 'property');
  return description;
}

function getMediaType(doc: cheerio.CheerioAPI) {
  const node = metaTag(doc, 'medium', 'name');
  if (node) {
    const content = node.attr('content');
    return content === 'image' ? 'photo' : content;
  }
  return (
    metaTagContent(doc, 'og:type', 'property') || metaTagContent(doc, 'og:type', 'name')
  );
}

function getImages(
  doc: cheerio.CheerioAPI,
  rootUrl: string,
  imagesPropertyType?: string
) {
  let images: string[] = [];
  let nodes: cheerio.Cheerio<cheerio.Element> | null;
  let src: string | undefined;
  let dic: Record<string, boolean> = {};

  const imagePropertyType = imagesPropertyType ?? 'og';
  nodes =
    metaTag(doc, `${imagePropertyType}:image`, 'property') ||
    metaTag(doc, `${imagePropertyType}:image`, 'name');

  if (nodes) {
    nodes.each((_: number, node: cheerio.Element) => {
      if (node.type === 'tag') {
        src = node.attribs.content;
        if (src) {
          src = new URL(src, rootUrl).href;
          images.push(src);
        }
      }
    });
  }

  if (images.length <= 0 && !imagesPropertyType) {
    src = doc('link[rel=image_src]').attr('href');
    if (src) {
      src = new URL(src, rootUrl).href;
      images = [src];
    } else {
      nodes = doc('img');

      if (nodes?.length) {
        dic = {};
        images = [];
        nodes.each((_: number, node: cheerio.Element) => {
          if (node.type === 'tag') src = node.attribs.src;
          if (src && !dic[src]) {
            dic[src] = true;
            // width = node.attribs.width;
            // height = node.attribs.height;
            images.push(new URL(src, rootUrl).href);
          }
        });
      }
    }
  }

  return images;
}

function getVideos(doc: cheerio.CheerioAPI) {
  const videos = [];
  let nodeTypes;
  let nodeSecureUrls;
  let nodeType;
  let nodeSecureUrl;
  let video;
  let videoType;
  let videoSecureUrl;
  let width;
  let height;
  let videoObj;
  let index;

  const nodes = metaTag(doc, 'og:video', 'property') || metaTag(doc, 'og:video', 'name');

  if (nodes?.length) {
    nodeTypes =
      metaTag(doc, 'og:video:type', 'property') || metaTag(doc, 'og:video:type', 'name');
    nodeSecureUrls =
      metaTag(doc, 'og:video:secure_url', 'property') ||
      metaTag(doc, 'og:video:secure_url', 'name');
    width =
      metaTagContent(doc, 'og:video:width', 'property') ||
      metaTagContent(doc, 'og:video:width', 'name');
    height =
      metaTagContent(doc, 'og:video:height', 'property') ||
      metaTagContent(doc, 'og:video:height', 'name');

    for (index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      if (node.type === 'tag') video = node.attribs.content;

      nodeType = nodeTypes?.[index];
      if (nodeType?.type === 'tag') {
        videoType = nodeType ? nodeType.attribs.content : null;
      }

      nodeSecureUrl = nodeSecureUrls?.[index];
      if (nodeSecureUrl?.type === 'tag') {
        videoSecureUrl = nodeSecureUrl ? nodeSecureUrl.attribs.content : null;
      }

      videoObj = {
        url: video,
        secureUrl: videoSecureUrl,
        type: videoType,
        width,
        height,
      };
      if (videoType && videoType.indexOf('video/') === 0) {
        videos.splice(0, 0, videoObj);
      } else {
        videos.push(videoObj);
      }
    }
  }

  return videos;
}

// returns default favicon (//hostname/favicon.ico) for a url
function getDefaultFavicon(rootUrl: string) {
  return `${new URL(rootUrl).origin}/favicon.ico`;
}

// returns an array of URLs to favicon images
function getFavicons(doc: cheerio.CheerioAPI, rootUrl: string) {
  const images = [];
  let nodes: cheerio.Cheerio<cheerio.Element> | never[] = [];
  let src: string | undefined;

  const relSelectors = ['rel=icon', `rel="shortcut icon"`, 'rel=apple-touch-icon'];

  relSelectors.forEach((relSelector) => {
    // look for all icon tags
    nodes = doc(`link[${relSelector}]`);

    // collect all images from icon tags
    if (nodes.length) {
      nodes.each((_: number, node: cheerio.Element) => {
        if (node.type === 'tag') src = node.attribs.href;
        if (src) {
          src = new URL(rootUrl).href;
          images.push(src);
        }
      });
    }
  });

  // if no icon images, use default favicon location
  if (images.length <= 0) {
    images.push(getDefaultFavicon(rootUrl));
  }

  return images;
}

function parseImageResponse(url: string, contentType: string) {
  return {
    url,
    mediaType: 'image',
    contentType,
    favicons: [getDefaultFavicon(url)],
  };
}

function parseAudioResponse(url: string, contentType: string) {
  return {
    url,
    mediaType: 'audio',
    contentType,
    favicons: [getDefaultFavicon(url)],
  };
}

function parseVideoResponse(url: string, contentType: string) {
  return {
    url,
    mediaType: 'video',
    contentType,
    favicons: [getDefaultFavicon(url)],
  };
}

function parseApplicationResponse(url: string, contentType: string) {
  return {
    url,
    mediaType: 'application',
    contentType,
    favicons: [getDefaultFavicon(url)],
  };
}

function parseTextResponse(
  body: string,
  url: string,
  options: ILinkPreviewOptions = {},
  contentType?: string
) {
  const doc = cheerio.load(body);

  return {
    url,
    title: getTitle(doc),
    siteName: getSiteName(doc),
    description: getDescription(doc),
    mediaType: getMediaType(doc) || 'website',
    contentType,
    images: getImages(doc, url, options.imagesPropertyType),
    videos: getVideos(doc),
    favicons: getFavicons(doc, url),
  };
}

function parseUnknownResponse(
  body: string,
  url: string,
  options: ILinkPreviewOptions = {},
  contentType?: string
) {
  return parseTextResponse(body, url, options, contentType);
}

function parseResponse(response: IPreFetchedResource, options?: ILinkPreviewOptions) {
  try {
    let contentType = response.headers['content-type'];
    // console.warn(`original content type`, contentType);
    if (contentType?.indexOf(';')) {
      // eslint-disable-next-line prefer-destructuring
      contentType = contentType.split(';')[0];
      // console.warn(`splitting content type`, contentType);
    }

    if (!contentType) {
      return parseUnknownResponse(response.data, response.url, options);
    }

    if ((contentType as any) instanceof Array) {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      contentType = contentType[0];
    }

    // parse response depending on content type
    if (OPENGRAPH.REGEX_CONTENT_TYPE_IMAGE.test(contentType)) {
      return parseImageResponse(response.url, contentType);
    }
    if (OPENGRAPH.REGEX_CONTENT_TYPE_AUDIO.test(contentType)) {
      return parseAudioResponse(response.url, contentType);
    }
    if (OPENGRAPH.REGEX_CONTENT_TYPE_VIDEO.test(contentType)) {
      return parseVideoResponse(response.url, contentType);
    }
    if (OPENGRAPH.REGEX_CONTENT_TYPE_TEXT.test(contentType)) {
      const htmlString = response.data;
      return parseTextResponse(htmlString, response.url, options, contentType);
    }
    if (OPENGRAPH.REGEX_CONTENT_TYPE_APPLICATION.test(contentType)) {
      return parseApplicationResponse(response.url, contentType);
    }
    const htmlString = response.data;
    return parseUnknownResponse(htmlString, response.url, options);
  } catch (e) {
    throw new Error(
      `link-preview-js could not fetch link information ${(e as any).toString()}`
    );
  }
}

export async function getLinkPreview(text: string) {
  const fetchUrl = text;
  const options: FetchOptions = {
    method: 'GET',
    timeout: 5,
    responseType: ResponseType.Text,
  };

  let response = await fetch(fetchUrl, options);

  if (response.status > 300 && response.status < 309) {
    const forwardedUrl = response.headers.location || '';
    response = await fetch(forwardedUrl, options);
  }

  return parseResponse(response);
}
