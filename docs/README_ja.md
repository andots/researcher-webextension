# RE:SEARCHER

RE:SEARCHER はブックマークを全文検索可能にするブラウザ拡張です。

![screenshot](https://user-images.githubusercontent.com/18536/142749650-8a83b2d5-3124-453b-a462-a703cd139b3b.gif)

## 主な機能と特徴

### 全文検索

各ブックマークは[Elasticsearch](https://github.com/elastic/elasticsearch)にインデックスされます。検索ボックスは Elasticsearch の search_query が利用できます。例えば、以下のようなクエリを実行可能です。
`a AND b`, `"Quick Brown Fox"`, `abc*efg`, `site:github.com`, `bookmarkedAt:[2021-10 TO 2021-11]`

[Query string query | Elasticsearch Guide \[7.15\] | Elastic](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax)

### 多言語対応

ブックマーク本文の言語を自動的に推測して、各言語ごとのアナライザーを用いてインデックスを行います。現在の対応言語は英語、ドイツ語、日本語、韓国語、中国語で、他の言語は未知の言語として Elasticsearch のデフォルト設定で解析されます。日本語の解析には[WorksApplications/Sudachi: A Japanese Tokenizer for Business](https://github.com/WorksApplications/Sudachi)を利用しています。

### ローカルに保存

ブックマークは全てローカルの Elasticsearch に保存されます。ネットワークに個人の情報を流出させません。

### ブラウザ拡張

ブラウザのツールバーからワンクリックでブックマークすることが出来ます。
また、ブラウザのブックマーク一覧、ブックマーク HTML ファイル（各ブラウザやはてな等のソーシャルブックマークでバックアップしたもの）、テキストエリアから、既存のブックマークのインポートが可能です。

### 本文抽出とシンプルなページビュー

検索ノイズの低減を目的として、[mozilla/readability](https://github.com/mozilla/readability)を利用することで、出来る限りブックマークされたページの本文のみを抽出しています。また、この本文抽出機能を利用して、外部サイトに訪れること無く拡張内で提供されるシンプルなページビューで記事を閲覧することが出来ます。

### シンタックスハイライト

記事内のソースコードを自動で識別し、[highlightjs/highlight.js](https://github.com/highlightjs/highlight.js/)を利用することで言語ごとにハイライトを行います。

### 複数の検索結果 UI

検索エンジンライクな UI、OGP 画像付き、シンプルな Favicon とタイトル一覧、カードスタイルから好みの UI を簡単に変更出来ます。

### 後で読む

後で読むフラグのついたブックマークをホーム画面の上部に固定することが出来ます。また、検索ボックスで`isReadLater:true`とクエリを実行するか、サイドバーの押しピンアイコンから簡単にフィルタリング出来ます。

### お気に入り星５ランキング

個々のブックマークを星５評価でお気に入り設定できます。これらのランキングはフィルターに用いたり、検索の重みづけに利用出来ます。`検索キーワード AND stars:5`とクエリを実行すれば、キーワードにヒットかつ星５のブックマークのみを絞り込むことが出来ます。

### 動画ブックマーク

動画のブックマークはビューページで公式プレイヤーが自動的に埋め込まれます。また、サイドバーから簡単にフィルタリングを行えます。現在、YouTube にのみ対応していますが、随時他の動画サイトも対応予定です。

## セットアップ方法

拡張機能をブラウザにインストールするほかに、検索のバックエンドとして Elasticsearch をインストールする必要があります。
以下にセットアップの手順を示します。

## Docker

[https://github.com/andots/researcher-docker](https://github.com/andots/researcher-docker)

```bash
git clone https://github.com/andots/researcher-docker
# build & start
docker compose -p researcher up --build
# start
docker compose -p researcher up
```

## マニュアルでセットアップ

1. Elasticsearch ver. 7.10.1 のインストール
2. プラグインのインストール
3. Sudachi 設定ファイルの配置
4. Elasticsearch の起動
5. ブラウザ拡張からインデックスを作成する
6. (オプション) Kibana のインストール

### Windows Users

Windows ユーザーは次のページを参照してください。

[Windows 10 セットアップ手順](windows/README_ja.md).

### For Linux, OSX Users

### 1. Elasticsearch ver. 7.10.1 のインストール

利用するプラグインの都合上、Elasticsearch のバージョンを「**7.10.1**」に限定しています。バージョンが異なると正しくセットアップが行えませんので、ご注意ください。

以下の URL より Elasticsearch 本体の zip ファイルをダウンロードしてください。

[https://www.elastic.co/downloads/past-releases/elasticsearch-7-10-1](https://www.elastic.co/downloads/past-releases/elasticsearch-7-10-1)

ダウンロードしたファイルを以下のような場所に解凍して配置します。アクセス権限の問題が発生しない場所であれば、基本的にはどこでも構いません。

`/usr/share/elasticsearch`.

### 2. プラグインのインストール

#### 自動化スクリプトを利用する

[`docs/bash/researcher_setup.sh`](bash/researcher_setup.sh)を Elasticsearch のルート直下に配置して実行してください。

#### 手動で行う

以下のコマンドを Elasticsearch のルート直下で実行してください。

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

### 3 Sudachi 設定ファイルの配置

`config/sudachi`ディレクトリに、以下の json ファイルを`sudachi.json`と名前をつけ配置してください。

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

### 4. Elasticsearch

`bin/elasticsearch`を実行して、Elasticsearch を起動してください。

詳細については以下のオフィシャルのドキュメントを参照してください。

[Install Elasticsearch from archive on Linux or MacOS | Elasticsearch Guide \[7.15\] | Elastic](https://www.elastic.co/guide/en/elasticsearch/reference/current/targz.html)

### 5. ブラウザ拡張からインデックスを作成する

最後に、Elasticsearch を起動させた状態で、RE:SEARCHER ブラウザ拡張を開き、「インデックス作成」ボタンをクリックすれば、セットアップは完了です。

### 6. (オプション) Kibana のインストール

Kibana が必要な場合は、以下よりダウンロードしてください。(Elasticsearch とバージョンを合わせる必要があります)

[https://www.elastic.co/downloads/past-releases/kibana-7-10-1](https://www.elastic.co/downloads/past-releases/kibana-7-10-1)

## 開発方法

```bash
npm install -g pnpm
pnpm install
pnpm dev
```

`extension/`配下の manifest.json をブラウザに読み込ませてください。

## ビルド方法

```bash
pnpm build
```
