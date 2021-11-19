@echo off
setlocal enabledelayedexpansion
cd %~dp0

rem move sudachi.json config\sudachi\sudachi.json

rem Japanase Analyzer
call bin\elasticsearch-plugin.bat install --batch https://github.com/WorksApplications/elasticsearch-sudachi/releases/download/v2.1.0/analysis-sudachi-7.10.1-2.1.0.zip

rem Chinese Analyzer
call bin\elasticsearch-plugin.bat install --batch analysis-smartcn

rem Korean Analyzer
call bin\elasticsearch-plugin.bat install --batch analysis-nori

mkdir config\sudachi
curl -Lo sudachi-dictionary-20210802-full.zip http://sudachi.s3-website-ap-northeast-1.amazonaws.com/sudachidict/sudachi-dictionary-20210802-full.zip
call powershell -command "Expand-Archive sudachi-dictionary-20210802-full.zip"
move sudachi-dictionary-20210802-full\sudachi-dictionary-20210802\system_full.dic config\sudachi\system_core.dic
del sudachi-dictionary-20210802-full.zip
rmdir /s /q sudachi-dictionary-20210802-full

rem German Dictionary
mkdir config\analysis\de
curl -LO https://raw.githubusercontent.com/uschindler/german-decompounder/master/de_DR.xml
curl -LO https://raw.githubusercontent.com/uschindler/german-decompounder/master/dictionary-de.txt
move de_DR.xml config\analysis\de
move dictionary-de.txt config\analysis\de
