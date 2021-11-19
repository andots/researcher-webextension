// This code is originally based on the excellent work of @nicolashenry, in jsdom.
// https://github.com/jsdom/html-encoding-sniffer

export const crawl = async (url: string): Promise<string> => {
  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const buf = await response.arrayBuffer();
  const encoding = getEncoding(buf);
  return new TextDecoder(encoding).decode(buf);
};

export const getEncoding = (buf: ArrayBuffer, defaultEncoding = 'utf-8'): string => {
  const uint8Array = new Uint8Array(buf);
  let encoding = getBOMEncoding(uint8Array);

  if (encoding === null) {
    encoding = prescanMetaCharset(uint8Array);
  }

  if (encoding === null) {
    encoding = defaultEncoding;
  }

  return encoding.toLowerCase();
};

const getBOMEncoding = (uint8Array: Uint8Array) => {
  if (uint8Array[0] === 0xfe && uint8Array[1] === 0xff) {
    return 'UTF-16BE';
  } else if (uint8Array[0] === 0xff && uint8Array[1] === 0xfe) {
    return 'UTF-16LE';
  } else if (uint8Array[0] === 0xef && uint8Array[1] === 0xbb && uint8Array[2] === 0xbf) {
    return 'UTF-8';
  }

  return null;
};

// https://html.spec.whatwg.org/multipage/syntax.html#prescan-a-byte-stream-to-determine-its-encoding
function prescanMetaCharset(uint8Array: Uint8Array) {
  const l = Math.min(uint8Array.byteLength, 1024);
  for (let i = 0; i < l; i++) {
    let c = uint8Array[i];
    if (c === 0x3c) {
      // "<"
      const c1 = uint8Array[i + 1];
      const c2 = uint8Array[i + 2];
      const c3 = uint8Array[i + 3];
      const c4 = uint8Array[i + 4];
      const c5 = uint8Array[i + 5];
      // !-- (comment start)
      if (c1 === 0x21 && c2 === 0x2d && c3 === 0x2d) {
        i += 4;
        for (; i < l; i++) {
          c = uint8Array[i];
          const cMinus1 = uint8Array[i - 1];
          const cMinus2 = uint8Array[i - 2];
          // --> (comment end)
          if (c === 0x3e && cMinus1 === 0x2d && cMinus2 === 0x2d) {
            break;
          }
        }
      } else if (
        (c1 === 0x4d || c1 === 0x6d) &&
        (c2 === 0x45 || c2 === 0x65) &&
        (c3 === 0x54 || c3 === 0x74) &&
        (c4 === 0x41 || c4 === 0x61) &&
        (isSpaceCharacter(c5) || c5 === 0x2f)
      ) {
        // "meta" + space or /
        i += 6;
        const attributeList = new Set();
        let gotPragma = false;
        let needPragma = null;
        let charset = null;

        let attrRes;
        do {
          attrRes = getAttribute(uint8Array, i, l);
          if (attrRes.attr && !attributeList.has(attrRes.attr.name)) {
            attributeList.add(attrRes.attr.name);
            if (attrRes.attr.name === 'http-equiv') {
              gotPragma = attrRes.attr.value === 'content-type';
            } else if (attrRes.attr.name === 'content' && !charset) {
              charset = extractCharacterEncodingFromMeta(attrRes.attr.value);
              if (charset !== null) {
                needPragma = true;
              }
            } else if (attrRes.attr.name === 'charset') {
              charset = labelToName(attrRes.attr.value);
              needPragma = false;
            }
          }
          i = attrRes.i;
        } while (attrRes.attr);

        if (needPragma === null) {
          continue;
        }
        if (needPragma === true && gotPragma === false) {
          continue;
        }
        if (charset === null) {
          continue;
        }

        if (charset === 'UTF-16LE' || charset === 'UTF-16BE') {
          charset = 'UTF-8';
        }
        if (charset === 'x-user-defined') {
          charset = 'windows-1252';
        }

        return charset;
      } else if ((c1 >= 0x41 && c1 <= 0x5a) || (c1 >= 0x61 && c1 <= 0x7a)) {
        // a-z or A-Z
        for (i += 2; i < l; i++) {
          c = uint8Array[i];
          // space or >
          if (isSpaceCharacter(c) || c === 0x3e) {
            break;
          }
        }
        let attrRes;
        do {
          attrRes = getAttribute(uint8Array, i, l);
          i = attrRes.i;
        } while (attrRes.attr);
      } else if (c1 === 0x21 || c1 === 0x2f || c1 === 0x3f) {
        // ! or / or ?
        for (i += 2; i < l; i++) {
          c = uint8Array[i];
          // >
          if (c === 0x3e) {
            break;
          }
        }
      }
    }
  }
  return null;
}

// https://html.spec.whatwg.org/multipage/syntax.html#concept-get-attributes-when-sniffing
function getAttribute(uint8Array: Uint8Array, i: number, l: number) {
  for (; i < l; i++) {
    let c = uint8Array[i];
    // space or /
    if (isSpaceCharacter(c) || c === 0x2f) {
      continue;
    }
    // ">"
    if (c === 0x3e) {
      break;
    }
    let name = '';
    let value = '';
    nameLoop: for (; i < l; i++) {
      c = uint8Array[i];
      // "="
      if (c === 0x3d && name !== '') {
        i++;
        break;
      }
      // space
      if (isSpaceCharacter(c)) {
        for (i++; i < l; i++) {
          c = uint8Array[i];
          // space
          if (isSpaceCharacter(c)) {
            continue;
          }
          // not "="
          if (c !== 0x3d) {
            return { attr: { name, value }, i };
          }

          i++;
          break nameLoop;
        }
        break;
      }
      // / or >
      if (c === 0x2f || c === 0x3e) {
        return { attr: { name, value }, i };
      }
      // A-Z
      if (c >= 0x41 && c <= 0x5a) {
        name += String.fromCharCode(c + 0x20); // lowercase
      } else {
        name += String.fromCharCode(c);
      }
    }
    c = uint8Array[i];
    // space
    if (isSpaceCharacter(c)) {
      for (i++; i < l; i++) {
        c = uint8Array[i];
        // space
        if (isSpaceCharacter(c)) {
          continue;
        } else {
          break;
        }
      }
    }
    // " or '
    if (c === 0x22 || c === 0x27) {
      const quote = c;
      for (i++; i < l; i++) {
        c = uint8Array[i];

        if (c === quote) {
          i++;
          return { attr: { name, value }, i };
        }

        // A-Z
        if (c >= 0x41 && c <= 0x5a) {
          value += String.fromCharCode(c + 0x20); // lowercase
        } else {
          value += String.fromCharCode(c);
        }
      }
    }

    // >
    if (c === 0x3e) {
      return { attr: { name, value }, i };
    }

    // A-Z
    if (c >= 0x41 && c <= 0x5a) {
      value += String.fromCharCode(c + 0x20); // lowercase
    } else {
      value += String.fromCharCode(c);
    }

    for (i++; i < l; i++) {
      c = uint8Array[i];

      // space or >
      if (isSpaceCharacter(c) || c === 0x3e) {
        return { attr: { name, value }, i };
      }

      // A-Z
      if (c >= 0x41 && c <= 0x5a) {
        value += String.fromCharCode(c + 0x20); // lowercase
      } else {
        value += String.fromCharCode(c);
      }
    }
  }
  return { i };
}

function extractCharacterEncodingFromMeta(string: string) {
  let position = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const indexOfCharset = string.substring(position).search(/charset/iu);

    if (indexOfCharset === -1) {
      return null;
    }
    let subPosition = position + indexOfCharset + 'charset'.length;

    while (isSpaceCharacter(string[subPosition].charCodeAt(0))) {
      ++subPosition;
    }

    if (string[subPosition] !== '=') {
      position = subPosition - 1;
      continue;
    }

    ++subPosition;

    while (isSpaceCharacter(string[subPosition].charCodeAt(0))) {
      ++subPosition;
    }

    position = subPosition;
    break;
  }

  if (string[position] === '"' || string[position] === "'") {
    const nextIndex = string.indexOf(string[position], position + 1);

    if (nextIndex !== -1) {
      return labelToName(string.substring(position + 1, nextIndex));
    }

    // It is an unmatched quotation mark
    return null;
  }

  if (string.length === position + 1) {
    return null;
  }

  const indexOfASCIIWhitespaceOrSemicolon = string
    .substring(position + 1)
    .search(/\\x09|\\x0A|\\x0C|\\x0D|\\x20|;/u);
  const end =
    indexOfASCIIWhitespaceOrSemicolon === -1
      ? string.length
      : position + indexOfASCIIWhitespaceOrSemicolon + 1;

  return labelToName(string.substring(position, end));
}

function isSpaceCharacter(c: any) {
  return c === 0x09 || c === 0x0a || c === 0x0c || c === 0x0d || c === 0x20;
}

const labelToName = (label: string): string | null => {
  label = String(label).trim().toLowerCase();
  return LABELS[label] || null;
};

const LABELS: Record<string, string> = {
  '866': 'IBM866',
  'unicode-1-1-utf-8': 'UTF-8',
  unicode11utf8: 'UTF-8',
  unicode20utf8: 'UTF-8',
  'utf-8': 'UTF-8',
  utf8: 'UTF-8',
  'x-unicode20utf8': 'UTF-8',
  cp866: 'IBM866',
  csibm866: 'IBM866',
  ibm866: 'IBM866',
  csisolatin2: 'ISO-8859-2',
  'iso-8859-2': 'ISO-8859-2',
  'iso-ir-101': 'ISO-8859-2',
  'iso8859-2': 'ISO-8859-2',
  iso88592: 'ISO-8859-2',
  'iso_8859-2': 'ISO-8859-2',
  'iso_8859-2:1987': 'ISO-8859-2',
  l2: 'ISO-8859-2',
  latin2: 'ISO-8859-2',
  csisolatin3: 'ISO-8859-3',
  'iso-8859-3': 'ISO-8859-3',
  'iso-ir-109': 'ISO-8859-3',
  'iso8859-3': 'ISO-8859-3',
  iso88593: 'ISO-8859-3',
  'iso_8859-3': 'ISO-8859-3',
  'iso_8859-3:1988': 'ISO-8859-3',
  l3: 'ISO-8859-3',
  latin3: 'ISO-8859-3',
  csisolatin4: 'ISO-8859-4',
  'iso-8859-4': 'ISO-8859-4',
  'iso-ir-110': 'ISO-8859-4',
  'iso8859-4': 'ISO-8859-4',
  iso88594: 'ISO-8859-4',
  'iso_8859-4': 'ISO-8859-4',
  'iso_8859-4:1988': 'ISO-8859-4',
  l4: 'ISO-8859-4',
  latin4: 'ISO-8859-4',
  csisolatincyrillic: 'ISO-8859-5',
  cyrillic: 'ISO-8859-5',
  'iso-8859-5': 'ISO-8859-5',
  'iso-ir-144': 'ISO-8859-5',
  'iso8859-5': 'ISO-8859-5',
  iso88595: 'ISO-8859-5',
  'iso_8859-5': 'ISO-8859-5',
  'iso_8859-5:1988': 'ISO-8859-5',
  arabic: 'ISO-8859-6',
  'asmo-708': 'ISO-8859-6',
  csiso88596e: 'ISO-8859-6',
  csiso88596i: 'ISO-8859-6',
  csisolatinarabic: 'ISO-8859-6',
  'ecma-114': 'ISO-8859-6',
  'iso-8859-6': 'ISO-8859-6',
  'iso-8859-6-e': 'ISO-8859-6',
  'iso-8859-6-i': 'ISO-8859-6',
  'iso-ir-127': 'ISO-8859-6',
  'iso8859-6': 'ISO-8859-6',
  iso88596: 'ISO-8859-6',
  'iso_8859-6': 'ISO-8859-6',
  'iso_8859-6:1987': 'ISO-8859-6',
  csisolatingreek: 'ISO-8859-7',
  'ecma-118': 'ISO-8859-7',
  elot_928: 'ISO-8859-7',
  greek: 'ISO-8859-7',
  greek8: 'ISO-8859-7',
  'iso-8859-7': 'ISO-8859-7',
  'iso-ir-126': 'ISO-8859-7',
  'iso8859-7': 'ISO-8859-7',
  iso88597: 'ISO-8859-7',
  'iso_8859-7': 'ISO-8859-7',
  'iso_8859-7:1987': 'ISO-8859-7',
  sun_eu_greek: 'ISO-8859-7',
  csiso88598e: 'ISO-8859-8',
  csisolatinhebrew: 'ISO-8859-8',
  hebrew: 'ISO-8859-8',
  'iso-8859-8': 'ISO-8859-8',
  'iso-8859-8-e': 'ISO-8859-8',
  'iso-ir-138': 'ISO-8859-8',
  'iso8859-8': 'ISO-8859-8',
  iso88598: 'ISO-8859-8',
  'iso_8859-8': 'ISO-8859-8',
  'iso_8859-8:1988': 'ISO-8859-8',
  visual: 'ISO-8859-8',
  csisolatin6: 'ISO-8859-10',
  'iso-8859-10': 'ISO-8859-10',
  'iso-ir-157': 'ISO-8859-10',
  'iso8859-10': 'ISO-8859-10',
  iso885910: 'ISO-8859-10',
  l6: 'ISO-8859-10',
  latin6: 'ISO-8859-10',
  'iso-8859-13': 'ISO-8859-13',
  'iso8859-13': 'ISO-8859-13',
  iso885913: 'ISO-8859-13',
  'iso-8859-14': 'ISO-8859-14',
  'iso8859-14': 'ISO-8859-14',
  iso885914: 'ISO-8859-14',
  csisolatin9: 'ISO-8859-15',
  'iso-8859-15': 'ISO-8859-15',
  'iso8859-15': 'ISO-8859-15',
  iso885915: 'ISO-8859-15',
  'iso_8859-15': 'ISO-8859-15',
  l9: 'ISO-8859-15',
  'iso-8859-16': 'ISO-8859-16',
  cskoi8r: 'KOI8-R',
  koi: 'KOI8-R',
  koi8: 'KOI8-R',
  'koi8-r': 'KOI8-R',
  koi8_r: 'KOI8-R',
  'koi8-ru': 'KOI8-U',
  'koi8-u': 'KOI8-U',
  csmacintosh: 'macintosh',
  mac: 'macintosh',
  macintosh: 'macintosh',
  'x-mac-roman': 'macintosh',
  'dos-874': 'windows-874',
  'iso-8859-11': 'windows-874',
  'iso8859-11': 'windows-874',
  iso885911: 'windows-874',
  'tis-620': 'windows-874',
  'windows-874': 'windows-874',
  cp1250: 'windows-1250',
  'windows-1250': 'windows-1250',
  'x-cp1250': 'windows-1250',
  cp1251: 'windows-1251',
  'windows-1251': 'windows-1251',
  'x-cp1251': 'windows-1251',
  'ansi_x3.4-1968': 'windows-1252',
  ascii: 'windows-1252',
  cp1252: 'windows-1252',
  cp819: 'windows-1252',
  csisolatin1: 'windows-1252',
  ibm819: 'windows-1252',
  'iso-8859-1': 'windows-1252',
  'iso-ir-100': 'windows-1252',
  'iso8859-1': 'windows-1252',
  iso88591: 'windows-1252',
  'iso_8859-1': 'windows-1252',
  'iso_8859-1:1987': 'windows-1252',
  l1: 'windows-1252',
  latin1: 'windows-1252',
  'us-ascii': 'windows-1252',
  'windows-1252': 'windows-1252',
  'x-cp1252': 'windows-1252',
  cp1253: 'windows-1253',
  'windows-1253': 'windows-1253',
  'x-cp1253': 'windows-1253',
  cp1254: 'windows-1254',
  csisolatin5: 'windows-1254',
  'iso-8859-9': 'windows-1254',
  'iso-ir-148': 'windows-1254',
  'iso8859-9': 'windows-1254',
  iso88599: 'windows-1254',
  'iso_8859-9': 'windows-1254',
  'iso_8859-9:1989': 'windows-1254',
  l5: 'windows-1254',
  latin5: 'windows-1254',
  'windows-1254': 'windows-1254',
  'x-cp1254': 'windows-1254',
  cp1255: 'windows-1255',
  'windows-1255': 'windows-1255',
  'x-cp1255': 'windows-1255',
  cp1256: 'windows-1256',
  'windows-1256': 'windows-1256',
  'x-cp1256': 'windows-1256',
  cp1257: 'windows-1257',
  'windows-1257': 'windows-1257',
  'x-cp1257': 'windows-1257',
  cp1258: 'windows-1258',
  'windows-1258': 'windows-1258',
  'x-cp1258': 'windows-1258',
  chinese: 'GBK',
  csgb2312: 'GBK',
  csiso58gb231280: 'GBK',
  gb2312: 'GBK',
  gb_2312: 'GBK',
  'gb_2312-80': 'GBK',
  gbk: 'GBK',
  'iso-ir-58': 'GBK',
  'x-gbk': 'GBK',
  gb18030: 'gb18030',
  big5: 'Big5',
  'big5-hkscs': 'Big5',
  'cn-big5': 'Big5',
  csbig5: 'Big5',
  'x-x-big5': 'Big5',
  cseucpkdfmtjapanese: 'EUC-JP',
  'euc-jp': 'EUC-JP',
  'x-euc-jp': 'EUC-JP',
  csshiftjis: 'Shift_JIS',
  ms932: 'Shift_JIS',
  ms_kanji: 'Shift_JIS',
  'shift-jis': 'Shift_JIS',
  shift_jis: 'Shift_JIS',
  sjis: 'Shift_JIS',
  'windows-31j': 'Shift_JIS',
  'x-sjis': 'Shift_JIS',
  cseuckr: 'EUC-KR',
  csksc56011987: 'EUC-KR',
  'euc-kr': 'EUC-KR',
  'iso-ir-149': 'EUC-KR',
  korean: 'EUC-KR',
  'ks_c_5601-1987': 'EUC-KR',
  'ks_c_5601-1989': 'EUC-KR',
  ksc5601: 'EUC-KR',
  ksc_5601: 'EUC-KR',
  'windows-949': 'EUC-KR',
  unicodefffe: 'UTF-16BE',
  'utf-16be': 'UTF-16BE',
  csunicode: 'UTF-16LE',
  'iso-10646-ucs-2': 'UTF-16LE',
  'ucs-2': 'UTF-16LE',
  unicode: 'UTF-16LE',
  unicodefeff: 'UTF-16LE',
  'utf-16': 'UTF-16LE',
  'utf-16le': 'UTF-16LE',
};
