#!/bin/bash

SCRIPT_DIR=$(cd $(dirname $0); pwd)

$SCRIPT_DIR/bin/elasticsearch-plugin install https://github.com/WorksApplications/elasticsearch-sudachi/releases/download/v2.1.0/analysis-sudachi-7.10.1-2.1.0.zip
$SCRIPT_DIR/bin/elasticsearch-plugin install analysis-smartcn
$SCRIPT_DIR/bin/elasticsearch-plugin install analysis-nori

mkdir -p config/sudachi
curl -Lo sudachi-dictionary-20210802-full.zip http://sudachi.s3-website-ap-northeast-1.amazonaws.com/sudachidict/sudachi-dictionary-20210802-full.zip
unzip sudachi-dictionary-20210802-full.zip
mv sudachi-dictionary-20210802/system_full.dic config/sudachi/system_core.dic
rm -rf sudachi-dictionary-20210802-full.zip sudachi-dictionary-20210802/

curl -LO https://raw.githubusercontent.com/uschindler/german-decompounder/master/de_DR.xml
curl -LO https://raw.githubusercontent.com/uschindler/german-decompounder/master/dictionary-de.txt
mkdir -p config/analysis/de
mv de_DR.xml config/analysis/de
mv dictionary-de.txt config/analysis/de
