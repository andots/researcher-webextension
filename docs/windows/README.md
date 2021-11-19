# How to setup for Windows 10

[日本語](README_ja.md)

1. Install Elasticsearch ver. 7.10.1
2. Install Elasticsearch Plugins
3. Save sudachi.json to `config/sudachi/sudachi.json`
4. Start Elasticsearch
5. Create indices from our browser extension
6. (Optional) Install Kibana

## 1. Install Elasticsearch ver. 7.10.1

Currently we only support **Elasticsearch ver. 7.10.1** for our search backend because of the plugins' dependencies. Please make sure your Elasticsearch version is **7.10.1**.

Download a zip file for Windows from the official site.

[https://www.elastic.co/downloads/past-releases/elasticsearch-7-10-1](https://www.elastic.co/downloads/past-releases/elasticsearch-7-10-1)

Unzip the file and locate to e.g. `C:\elasticsearch\elasticsearch-7.10.1`.

## 2. Install Elasticsearch Plugins

### Use an automation script

Copy [`researcher_setup.bat`](researcher_setup.bat) in a root folder of Elasticsearch, then execute it.

### Manually setup

Go to the root folder of Elasticsearch, then execute the following command with CMD.

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

## 3. Save sudachi.json to `config/sudachi/sudachi.json`

This file is for Japanse Morphological analysis.

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

## 4. Start Elasticsearch

Execute `bin\elasticsearch.bat` to start Elasticsearch.

You can automatically start Elasticsearch as a Windows service if you run the following command.

To install the service,

```cmd
bin\elasticsearch-service.bat install
```

To remove the service,

```cmd
bin\elasticsearch-service.bat remove
```

Please see the official document to find more information.

[Install Elasticsearch with .zip on Windows | Elasticsearch Guide \[7.15\] | Elastic](https://www.elastic.co/guide/en/elasticsearch/reference/current/zip-windows.html)

## 5. Create indices from our browser extension

Finally, create indices for RE:SEARCHER from our browser extension. Open app and click the button "CREATE INDICES".

## 6. (Optional) Install Kibana

If you need Kibana, downalod it from the the below. The version of Elasticsearch and Kibana must be the same.

[https://www.elastic.co/downloads/past-releases/kibana-7-10-1](https://www.elastic.co/downloads/past-releases/kibana-7-10-1)
