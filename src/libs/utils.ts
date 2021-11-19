import { Readability } from '@mozilla/readability';
import { serializeError } from 'serialize-error';

import { APP_NAME } from 'src/constants';
import myDOMPurify from 'src/libs/dompurify';
import type { Bookmark, EmbeddableType, UrlAndTitle } from 'src/types';

const dayOfWeekArray = ['日', '月', '火', '水', '木', '金', '土'];

export const formatDate = (date: Date, format: string): string => {
  format = format.replace(/yyyy/g, date.getFullYear().toString());
  format = format.replace(/MM/g, `0${date.getMonth() + 1}`.slice(-2));
  format = format.replace(/dd/g, `0${date.getDate()}`.slice(-2));
  format = format.replace(/HH/g, `0${date.getHours()}`.slice(-2));
  format = format.replace(/mm/g, `0${date.getMinutes()}`.slice(-2));
  format = format.replace(/ss/g, `0${date.getSeconds()}`.slice(-2));
  format = format.replace(/SSS/g, `00${date.getMilliseconds()}`.slice(-3));
  format = format.replace(/DDD/g, dayOfWeekArray[date.getDay()]);
  return format;
};

export const numberWithCommas = (x: number, fractionDigits: number): string => {
  return x.toFixed(fractionDigits).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getDecodedShortURL = (str: string, length: number): string => {
  try {
    const url = decodeURI(str);
    return truncateText(url, length);
  } catch {
    return truncateText(str, 100);
  }
};

export const truncateText = (str: string, len: number): string => {
  return str.length <= len ? str : `${str.substr(0, len)}...`;
};

export const uniq = (array: string[]): string[] => {
  return array.filter((elem, index, self) => self.indexOf(elem) === index);
};

export const scrollToTop = (): void => {
  window.scrollTo(0, 0);
};

export const isWebUrl = (urlStr: string): boolean => {
  try {
    const url = new URL(urlStr);
    if (url.protocol.includes('http')) {
      return true;
    }
    return false;
  } catch {
    // ! new URL(str) throw error if the str is not url
    return false;
  }
};

export const hasUrlHash = (urlStr: string): boolean => {
  try {
    const url = new URL(urlStr);
    if (url.hash !== '') {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const removeUrlHash = (urlStr: string): string => {
  const url = new URL(urlStr);
  if (url.hash !== '') {
    return url.origin + url.pathname + url.search;
  }
  return url.href;
};

export const hasUrlHashOrSearch = (urlStr: string): boolean => {
  const url = new URL(urlStr);
  if (url.search !== '' || url.hash !== '') {
    return true;
  }
  return false;
};

export const prepareBookmark = (urlStr: string, htmlText: string): Bookmark => {
  try {
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
    // ! set baseURI to doc for relative path
    const baseEl = doc.createElement('base');
    baseEl.setAttribute('href', urlStr);
    doc.head.append(baseEl);
    // ! get og image
    const ogImageElement = doc.querySelectorAll('meta[property="og:image"]')[0];
    const ogImage =
      ogImageElement && ogImageElement.hasAttribute('content')
        ? ogImageElement.getAttribute('content')
        : undefined;
    // ! prepare for the common info
    const url = new URL(urlStr);
    const href = url.href;
    const site = url.hostname;
    const bookmarkedAt = new Date().toISOString();
    // ! parse with readability
    const article = new Readability(doc, { charThreshold: 500 }).parse();
    if (article) {
      const bookmark: Bookmark = {
        url: href,
        site,
        title: article.title,
        excerpt: article.excerpt,
        content: article.textContent.trim(), // ! trim white space and \n at beginning and ending
        html: myDOMPurify.sanitize(article.content), // ! sanitize
        bookmarkedAt,
        ogImage: ogImage ? ogImage : undefined,
      };
      return bookmark;
    }
    // ! if readability can't parsed
    const titleElement = doc.head.querySelector('title');
    const title =
      titleElement && titleElement.textContent ? titleElement.textContent : 'No Name';
    const bookmark: Bookmark = {
      url: href,
      site,
      title,
      excerpt: '',
      content: '',
      html: '',
      bookmarkedAt,
      ogImage: ogImage ? ogImage : undefined,
    };
    return bookmark;
  } catch (e) {
    const error = serializeError(e);
    throw new Error(error.message);
  }
};

export const makeNetscapeBookmarksHtml = (bookmarks: UrlAndTitle[]): string => {
  const total = bookmarks.length.toLocaleString();
  const header = [
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
    '<!-- This is an automatically generated file.',
    '     It will be read and overwritten.',
    '     DO NOT EDIT! -->',
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    `<TITLE>${APP_NAME} Bookmarks (Total: ${total})</TITLE>`,
    `<H1>${APP_NAME} Bookmarks (Total: ${total})</H1>`,
  ].join('\n');
  // const urlfields = ['add_date', 'last_visit', 'last_modified', 'icon', 'image'];
  const html: string[] = [];
  html.push(header);
  html.push('<DL><p>');
  html.push(`<DT><H3>${APP_NAME}</H3>`);
  html.push('  <DL><p>');
  bookmarks.forEach((b) => {
    html.push(`    <DT><A HREF="${b.url}">${b.title}</A>`);
  });
  html.push('  </DL><p>');
  html.push('</DL><p>');

  return html.join('\n');
};

// ! These match regex comes from ReactPlayer
// https://github.com/cookpete/react-player/blob/master/src/patterns.js
export const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
export const MATCH_URL_SOUNDCLOUD = /(?:soundcloud\.com|snd\.sc)\/[^.]+$/;
export const MATCH_URL_VIMEO = /vimeo\.com\/.+/;
export const MATCH_URL_FACEBOOK =
  /^https?:\/\/(www\.)?facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;
export const MATCH_URL_FACEBOOK_WATCH = /^https?:\/\/fb\.watch\/.+$/;
export const MATCH_URL_STREAMABLE = /streamable\.com\/([a-z0-9]+)$/;
export const MATCH_URL_WISTIA = /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/;
export const MATCH_URL_TWITCH_VIDEO = /(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/;
export const MATCH_URL_TWITCH_CHANNEL =
  /(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)($|\?)/;
export const MATCH_URL_DAILYMOTION =
  /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?$/;
export const MATCH_URL_MIXCLOUD = /mixcloud\.com\/([^/]+\/[^/]+)/;
export const MATCH_URL_VIDYARD = /vidyard.com\/(?:watch\/)?([a-zA-Z0-9-]+)/;

export const getEmbeddable = (url: string): EmbeddableType => {
  const data: EmbeddableType = {
    isEmbeddable: false,
  };

  try {
    const u = new URL(url);
    const hostname = u.hostname.toLowerCase();
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      const match = url.match(MATCH_URL_YOUTUBE);

      if (match != null) {
        const [, identifier] = match;
        data.provider = 'youtube';
        data.identifier = identifier;
        data.isEmbeddable = true;
      }
    }
    return data;
  } catch {
    return data;
  }
};

const MATCH_PHRASE = new RegExp(/^"(.+)"$/);
const MATCH_NOT = new RegExp(/^-(.+)/);
type SearchType = {
  mode: 'not' | 'phrase' | 'word';
  word: string;
};

export const analyzeKeywords = (keywords: string): SearchType[] => {
  const keywordsArray = keywords.split(/[\u{20}\u{3000}]/u);
  const searchTypes: SearchType[] = [];
  keywordsArray.forEach((elem) => {
    if (elem === '' || elem === '-' || elem === '+') {
      return;
    }

    const matchPhrase = elem.match(MATCH_PHRASE);
    const matchNot = elem.match(MATCH_NOT);

    if (matchPhrase != null && matchPhrase.length > 1) {
      const word = matchPhrase[1];
      if (word !== '') searchTypes.push({ mode: 'phrase', word });
    } else if (matchNot != null && matchNot.length > 1) {
      const word = matchNot[1];
      if (word !== '') searchTypes.push({ mode: 'not', word });
    } else {
      searchTypes.push({ mode: 'word', word: elem });
    }
  });
  return searchTypes;
};
