# RE:SEARCHER

[日本語](docs/README_ja.md)

RE:SEARCHER is a personal search engine for your bookmarks.

![screenshot](https://user-images.githubusercontent.com/18536/142749650-8a83b2d5-3124-453b-a462-a703cd139b3b.gif)

## Features of RE:SEARCHER

### Full-text Search

Search title, every word of content, excerpt, and url of bookmarks powered by [Elasticsearch](https://github.com/elastic/elasticsearch). Search box accepts Elasticsearch search_query, for example `a AND b`, `"Quick Brown Fox"`, `abc*efg`, `site:github.com`, `bookmarkedAt:[2021-10 TO 2021-11]`.

[Query string query | Elasticsearch Guide \[7.15\] | Elastic](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax)

### Multilingual Index/Search Support

Automatically guessing the language of the content, indexing with each language analyzer. Currently supports English, German, Japanese, Korean, and Chinese. Others are analyzed as Elasticsearch default.

### All Bookmarks Saved Locally

Your bookmarks will be saved to your local machine. No cloud services.

### Browser Extension (WebExtension)

Easy to bookmark from browser toolbar. Import bookmarks from your browser's bookmarks, exported bookmark html, textarea.

### Extract Content Body & Simple Page View

Only content body of webpage will be extracted as much as possible thanks to [mozilla/readability](https://github.com/mozilla/readability). Also, you can read articles with simple and fast page view without visiting website.

### Auto Syntax Highlighting

Codes in content are automatically detected and highlighted with [highlightjs/highlight.js](https://github.com/highlightjs/highlight.js/).

### Flexible Search Results

Switch the results UI - Search engine like view, with OGP(Open Graph Protocol) image, simple favicon and title view, tiled card style.

### Mark as Read Later

Bookmarks marked as "Read Later" will be pinned on the top of Home. Also, you can easily find articles by the query `isReadLater:true` or pushpin icon on sidebar menu.

### Favorite Star Rank

5 stars rank of each bookmark to filter and weight search results.

### Video Bookmarks

Filter video bookmarks from sidebar. Official video player will be embedded on view page. Currently supports only YouTube.

## Install WebExtension

[![Fx-Browser-icon-fullColor-128](https://user-images.githubusercontent.com/18536/143271864-8bd82d4b-a5df-431b-bafb-6cbf04194a3e.png)](https://addons.mozilla.org/en-US/firefox/addon/researcher-bookmarks/)

[Firefox Addon Page](https://addons.mozilla.org/en-US/firefox/addon/researcher-bookmarks/)

## How to Setup Search Backend

You need to install webextension to browser and Elasticsearch as a search backend.

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
