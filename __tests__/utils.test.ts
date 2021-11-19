/* eslint-disable jest/no-commented-out-tests */
import {
  analyzeKeywords,
  formatDate,
  getDecodedShortURL,
  hasUrlHash,
  isWebUrl,
  removeUrlHash,
  truncateText,
  uniq,
} from 'src/libs/utils';

describe('src/libs/utils', () => {
  test('getDecodedShortURL', () => {
    const a = getDecodedShortURL(
      'https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8',
      100,
    );
    expect(a).toBe('https://ja.wikipedia.org/wiki/メインページ');
    const b = getDecodedShortURL(
      'https://seesaawiki.jp/aigis/d/%c6%c3%bc%ec%b9%e7%c0%ae%c9%bd',
      100,
    );
    expect(b).toBe('https://seesaawiki.jp/aigis/d/%c6%c3%bc%ec%b9%e7%c0%ae%c9%bd');
  });

  test('truncate', () => {
    const testStr = '1234567890123456789012345';
    const a = truncateText(testStr, 10);
    expect(a).toBe('1234567890...');
  });

  test('uniq', () => {
    const array = ['111', '222', '111'];
    const array2 = uniq(array);
    expect(array2).toEqual(['111', '222']);
  });

  test('isWebUrl', () => {
    expect(isWebUrl('fafaveafv')).toBe(false);
    expect(isWebUrl('http://www.google.com/')).toBe(true);
    expect(isWebUrl('https://www.yahoo.com/')).toBe(true);
    expect(isWebUrl('ftp://www.google.com')).toBe(false);
  });

  test('hasUrlHash', () => {
    expect(hasUrlHash('aaa')).toBe(false);
    expect(hasUrlHash('http://www.google.com')).toBe(false);
    expect(hasUrlHash('http://www.google.com/aaa#bbb')).toBe(true);
    expect(hasUrlHash('http://www.google.com/?q=a#bbb')).toBe(true);
  });

  test('removeUrlHash', () => {
    expect(removeUrlHash('http://www.google.com')).toBe('http://www.google.com/');
    expect(removeUrlHash('http://www.google.com/')).toBe('http://www.google.com/');
    expect(removeUrlHash('http://www.google.com/aaa#bbb')).toBe(
      'http://www.google.com/aaa',
    );
    expect(removeUrlHash('http://www.google.com/?q=a#bbb')).toBe(
      'http://www.google.com/?q=a',
    );
    expect(() => removeUrlHash('aaa')).toThrowError();
  });

  test('analyzeKeywords', () => {
    const keywords = 'aaa bbb -ccc "ddd"';
    const result = analyzeKeywords(keywords);
    expect(result[0]).toEqual({ mode: 'word', word: 'aaa' });
    expect(result[1]).toEqual({ mode: 'word', word: 'bbb' });
    expect(result[2]).toEqual({ mode: 'not', word: 'ccc' });
    expect(result[3]).toEqual({ mode: 'phrase', word: 'ddd' });
  });

  test('analyzeKeywords including Japanese', () => {
    const keywords = 'aaa こんにちは　-あいうえお　"日本語"';
    const result = analyzeKeywords(keywords);
    expect(result[0]).toEqual({ mode: 'word', word: 'aaa' });
    expect(result[1]).toEqual({ mode: 'word', word: 'こんにちは' });
    expect(result[2]).toEqual({ mode: 'not', word: 'あいうえお' });
    expect(result[3]).toEqual({ mode: 'phrase', word: '日本語' });
  });

  test('formatDate', () => {
    const today = new Date(2000, 10, 12);
    expect(formatDate(today, 'yyyyMMdd')).toBe('20001112');
    expect(formatDate(today, 'yyyy年MM月dd日')).toBe('2000年11月12日');
  });
});

// import { /* waitFor, screen, RenderResult */ act, render } from '@testing-library/preact';
// import App from 'src/app/App';

// export {};

// describe('app', () => {
//   beforeEach(() => {
//     jest.useFakeTimers();
//   });

//   afterEach(() => {
//     jest.useRealTimers();
//   });

//   test('adds 1 + 2 to equal 3', () => {
//     const expected: number = 3;
//     expect(1 + 2).toBe(expected);
//   });

// test('renders the app', () => {
//   const testMessage = 'Learn Preact';
//   const { getByText } = render(<App />);
//   expect(getByText(testMessage)).not.toBeNull();
// });

// test('renders the app', () => {
//   const testMessage = 'Hello Vite';
//   const testMessage2 = `${testMessage} + Preact!`;
//   const { getByText } = render(<App />);

//   expect(getByText(testMessage)).not.toBeNull();

//   act(() => {
//     jest.advanceTimersByTime(1000);
//   });

//   // screen.debug()
//   expect(getByText(testMessage2)).not.toBeNull();
// });
// });
