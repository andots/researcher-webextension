import fs from 'fs';
import { resolve } from 'path';

import { getEncoding } from 'src/libs/crawl';

const __dirname = process.cwd();

const getTestDataPath = (...args: string[]): string =>
  resolve(__dirname, '__tests__', 'data', ...args);

const read = (path: string) => {
  const buffer = fs.readFileSync(path);
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};

describe('src/libs/crawl', () => {
  test('getEncoding shift_jis', async () => {
    const buf = read(getTestDataPath('shift_jis.html'));
    const encoding = getEncoding(buf);
    expect(encoding).toBe('shift_jis');
  });

  test('getEncoding euc-jp', async () => {
    const buf = read(getTestDataPath('euc_jp.html'));
    const encoding = getEncoding(buf);
    expect(encoding).toBe('euc-jp');
  });
});
