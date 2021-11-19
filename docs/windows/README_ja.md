# Windows 10 セットアップ手順

1. Elasticsearch ver. 7.10.1 のインストール
2. プラグインのインストール
3. Sudachi 設定ファイルの配置
4. Elasticsearch の起動
5. ブラウザ拡張からインデックスを作成する
6. (オプション) Kibana のインストール

## 1. Elasticsearch ver. 7.10.1 のインストール

利用するプラグインの都合上、Elasticsearch のバージョンを「**7.10.1**」に限定しています。バージョンが異なると正しくセットアップが行えませんので、ご注意ください。

以下の URL より Elasticsearch 本体の zip ファイルをダウンロードしてください。

[https://www.elastic.co/downloads/past-releases/elasticsearch-7-10-1](https://www.elastic.co/downloads/past-releases/elasticsearch-7-10-1)

ダウンロードした zip ファイルを以下のような場所に解凍して配置します。アクセス権限の問題が発生しない場所であれば、基本的にはどこでも構いません。

`C:\elasticsearch\elasticsearch-7.10.1`

## 2. プラグインのインストール

### 自動化スクリプトを利用する

[`researcher_setup.bat`](researcher_setup.bat)を解凍したフォルダの直下にコピーして、実行してください。

### 手動で行う

コマンドプロンプトで解凍した場所に移動し、以下のコマンドを実行してください。

```cmd
cd C:\elasticsearch\elasticsearch-7.10.1

bin\elasticsearch-plugin install https://github.com/WorksApplications/elasticsearch-sudachi/releases/download/v2.1.0/analysis-sudachi-7.10.1-2.1.0.zip

bin\elasticsearch-plugin install analysis-smartcn

bin\elasticsearch-plugin install analysis-nori

mkdir config\sudachi
curl -Lo sudachi-dictionary-20210802-full.zip http://sudachi.s3-website-ap-northeast-1.amazonaws.com/sudachidict/sudachi-dictionary-20210802-full.zip
call powershell -command "Expand-Archive sudachi-dictionary-20210802-full.zip"
move sudachi-dictionary-20210802-full\sudachi-dictionary-20210802\system_full.dic config\sudachi\system_core.dic
del sudachi-dictionary-20210802-full.zip
rmdir /s /q sudachi-dictionary-20210802-full

mkdir config\analysis\de
curl -LO https://raw.githubusercontent.com/uschindler/german-decompounder/master/de_DR.xml
curl -LO https://raw.githubusercontent.com/uschindler/german-decompounder/master/dictionary-de.txt
move de_DR.xml config\analysis\de
move dictionary-de.txt config\analysis\de
```

## 3. Sudachi 設定ファイルの配置

`config\sudachi`ディレクトリに、以下の json ファイルを`sudachi.json`と名前をつけ配置してください。

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

## 4. Elasticsearch の起動

`bin\elasticsearch.bat`を実行、またはダブルクリックすると Elasticsearch が起動します。

以下のコマンドを実行して、Windows サービスへ登録すれば、ログイン後 Elasticsearch を自動起動させることも可能です。不要な場合は、remove コマンドでサービス登録を解除できます。

```cmd
bin\elasticsearch-service.bat install
```

```cmd
bin\elasticsearch-service.bat remove
```

詳細は、以下の公式ドキュメントを参考にしてください。

[Install Elasticsearch with .zip on Windows | Elasticsearch Guide \[7.15\] | Elastic](https://www.elastic.co/guide/en/elasticsearch/reference/current/zip-windows.html)

## 5. ブラウザ拡張からインデックスを作成する

最後に、Elasticsearch を起動させた状態で、RE:SEARCHER ブラウザ拡張を開き、「インデックス作成」ボタンをクリックすれば、セットアップは完了です。

## 6. (オプション) Kibana のインストール

Kibana が必要な場合は、以下よりダウンロードしてください。(Elasticsearch とバージョンを合わせる必要があります)

[https://www.elastic.co/downloads/past-releases/kibana-7-10-1](https://www.elastic.co/downloads/past-releases/kibana-7-10-1)
