'use strict';

//ファイル読み込み
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {}});
const map = new Map();
rl.on('line', (lineString) => {
    //この行は、引数 lineString で与えられた文字列をカンマ , で分割して、それを columns という配列にしています。
    const columns = lineString.split(',');
    //下記では配列 columns の要素へ並び順の番号でアクセスして、集計年、都道府県、15?19 歳の人口、をそれぞれ変数に保存しています。
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    //文字列を整数値に
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        //*
        //オブジェクトのプロパティ popu10 が 2010 年の人口、 popu15 が 2015 年の人口、 change が人口の変化率を表すプロパティです。
        //変化率には、初期値では null を代入しておきます。
        //
        if (year === 2010){
            value.popu10 += popu;
        }
        if (year === 2015){
            value.popu15 += popu;
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1,pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    //Map の キーと値が要素になった配列を要素 pair として受け取り、それを文字列に変換する
    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率' + pair[1].change;
    });
    console.log(rankingStrings);
});

