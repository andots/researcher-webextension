# RE:SEARCHER

[日本語](docs/README_ja.md)

RE:SEARCHER is a personal search engine for your bookmarks.

## Features of RE:SEARCHER

- A browser extension (webextension).
- All bookmarks will be saved to your local machine.
- Full-text search title, content, and url of bookmarks powered by [Elasticsearch](https://github.com/elastic/elasticsearch)
- Multi-languages support - automatically guessing the language of the content, indexing with each language analyzer. Currently supports English, German, Japanese, Korean, and Chinese. Others are analyzed as Elasticsearch default.
- Bookmark from a browser toolbar.
- Import bookmarks from browser, exported bookmark html, textarea.
- Extract only content body and simple page view with [mozilla/readability](https://github.com/mozilla/readability).
- Automatic syntax highlighting of codes in contents.
- Search results can be shown with OGP(Open Graph Protocol) image.
- Mark as Read Later.
- Filter by your favorite rank (stars).
- Filter video bookmarks and embed official video player.

## How to Setup Search Backend

You need to install Elasticsearch as a search backend.

## Docker

[https://github.com/andots/researcher-docker](https://github.com/andots/researcher-docker)

```bash
git clone https://github.com/andots/researcher-docker
# build & start
docker compose -p researcher up --build
# start
docker compose -p researcher up
```

## Manually Setup

1. Install Elasticsearch ver. 7.10.1
2. Install Elasticsearch Plugins
3. Save sudachi.json to `config/sudachi/sudachi.json`
4. Start Elasticsearch
5. Create indices from our browser extension
6. (Optional) Install Kibana

### For Windows Users

Please see [How to setup for Windows 10](docs/windows/README.md).

### For Linux, OSX Users

### 1. Install Elasticsearch ver. 7.10.1

Currently we only support **Elasticsearch ver. 7.10.1** for our search backend because of the plugins' dependencies. Please make sure your Elasticsearch version is **7.10.1**.

Download Elasticsearch for your platform from the official.

[https://www.elastic.co/downloads/past-releases/elasticsearch-7-10-1](https://www.elastic.co/downloads/past-releases/elasticsearch-7-10-1)

Decompress the file and locate to e.g. `/usr/share/elasticsearch`.

### 2. Install Elasticsearch Plugins

#### Use an automation script

Copy [`docs/bash/researcher_setup.sh`](docs/bash/researcher_setup.sh) in a root folder of Elasticsearch, then execute it.

And save `sudachi.json` to `config/sudachi/sudachi.json`.

#### Or step by step

```bash
cd path_to_your_elasticsearch

bin/elasticsearch-plugin install https://github.com/WorksApplications/elasticsearch-sudachi/releases/download/v2.1.0/analysis-sudachi-7.10.1-2.1.0.zip
bin/elasticsearch-plugin install analysis-smartcn
bin/elasticsearch-plugin install analysis-nori

mkdir -p config/sudachi
curl -Lo sudachi-dictionary-20210802-full.zip http://sudachi.s3-website-ap-northeast-1.amazonaws.com/sudachidict/sudachi-dictionary-20210802-full.zip
unzip sudachi-dictionary-20210802-full.zip
mv sudachi-dictionary-20210802/system_full.dic /usr/share/elasticsearch/config/sudachi/system_core.dic
rm -rf sudachi-dictionary-20210802-full.zip sudachi-dictionary-20210802/

curl -LO https://raw.githubusercontent.com/uschindler/german-decompounder/master/de_DR.xml
curl -LO https://raw.githubusercontent.com/uschindler/german-decompounder/master/dictionary-de.txt
mkdir -p /usr/share/elasticsearch/config/analysis/de
mv de_DR.xml /usr/share/elasticsearch/config/analysis/de
mv dictionary-de.txt /usr/share/elasticsearch/config/analysis/de
```

### 3 Save sudachi.json to `config/sudachi/sudachi.json`

```bash
touch config/sudachi/sudachi.json
```

```json
{
  "systemDict": "system_core.dic",
  "inputTextPlugin": [
    { "class": "com.worksap.nlp.sudachi.DefaultInputTextPlugin" },
    {
      "class": "com.worksap.nlp.sudachi.ProlongedSoundMarkInputTextPlugin",
      "prolongedSoundMarks": ["ー", "-", "⁓", "〜", "〰"],
      "replacementSymbol": "ー"
    }
  ],
  "oovProviderPlugin": [
    { "class": "com.worksap.nlp.sudachi.MeCabOovProviderPlugin" },
    {
      "class": "com.worksap.nlp.sudachi.SimpleOovProviderPlugin",
      "oovPOS": ["補助記号", "一般", "*", "*", "*", "*"],
      "leftId": 5968,
      "rightId": 5968,
      "cost": 3857
    }
  ],
  "pathRewritePlugin": [
    { "class": "com.worksap.nlp.sudachi.JoinNumericPlugin", "joinKanjiNumeric": true },
    {
      "class": "com.worksap.nlp.sudachi.JoinKatakanaOovPlugin",
      "oovPOS": ["名詞", "普通名詞", "一般", "*", "*", "*"],
      "minLength": 3
    }
  ]
}
```

### 4. Start Elasticsearch

Execute `bin/elasticsearch` to start Elasticsearch.

Please see the official document to find more information.

[Install Elasticsearch from archive on Linux or MacOS | Elasticsearch Guide \[7.15\] | Elastic](https://www.elastic.co/guide/en/elasticsearch/reference/current/targz.html)

### 5. Create indices from our browser extension

Finally, create indices for RE:SEARCHER from our browser extension. Open app and click the button "CREATE INDICES".

### 6. (Optional) Install Kibana

If you need Kibana, downalod it from the the below. The version of Elasticsearch and Kibana must be the same.

[https://www.elastic.co/downloads/past-releases/kibana-7-10-1](https://www.elastic.co/downloads/past-releases/kibana-7-10-1)

## Development

```bash
npm install -g pnpm
pnpm install
pnpm dev
```

Then **load extension in browser with the `extension/` folder**,

## Build

To build the extension, run

```bash
pnpm build
```

And then pack files under `extension`.
