let lawtext2obj;

{
/**
 * 判斷項款目
 */
const stratumRE = [
    /^(?! )/,
    /^第[一二三四五六七八九十]+類：/,          // 所得稅法第14條第1項
    /^\s*[一二三四五六七八九十]+(、|　|  )/,  // 憲法裡的「款」有些是全形空格，有些是兩個半形空格
    /^\s*[\(（][一二三四五六七八九十]+[\)）]/, // 有些括號是全形，有些是半形
    /^\s+\d+\./,
    /^\s+[\(（]\d+[\)）]/
];
const getStratum = text => {
    for(let i = stratumRE.length - 1; i >= 0; --i)
        if(stratumRE[i].test(text)) return i;
    return -1;
};


/**
 * 處理換行字元排版，輸出一維陣列。
 *
 * 所得稅法第14條第1項那種「類」裡面還有分「段」的，先加個換行然後併進前一個元素裡。
 * 該項第四類各款後還有一段，就會被錯誤地歸到該類第三款裡頭，不過先不管了。
 */
const text2paras = text => {
    const lines = text.trimEnd().split("\n").map(str => str.trimEnd());

    let paras = []; // 不管層級的項款目陣列
    let curPara = "";   // 處理中的項款目，不含空格，用於輸出
    let firstLineInPara = ""; // 處理中的項款目的第一行原始文字，包含空格，用於判斷層級，以及是不是所得稅法第14條的情形。

    lines.forEach(line => {
        if(!curPara) firstLineInPara = line;
        curPara += line.trimStart();
        if(!/(：|︰|。|（刪除）)$/.test(line)) return;

        const stratum = getStratum(firstLineInPara);
        if(stratum < 0) paras[paras.length - 1].text += "\n" + curPara;
        else paras.push({
            text: curPara,
            stratum: stratum,
            children: []
        });

        // 有可能該行雖是句號結尾，但其實還沒有要分項，因此標示警告。
        if(line.length == 32 && line.charAt(31) == "。")
            paras[paras.length - 1].warning = true;

        curPara = "";
    });

    return paras;
};

/**
 * 把一維陣列轉成巢狀
 *
 * 方法：把項目塞到「前一個比自己高層級」的 children 裡。
 */
const arr2nested = (arr, depthProp = "stratum") => {
    let result = [];
    arr.forEach((item, i) => {
        const s = item[depthProp];
        if(s < 0) throw new Error("分層錯誤");
        if(s == 0) {
            result.push(item);
            return;
        }
        for(let j = i - 1; j >= 0; --j)
            if(arr[j][depthProp] < s) {
                if(!arr[j].children) arr[j].children = [];
                arr[j].children.push(item);
                return;
            }
    });
    return result;
}

lawtext2obj = text => arr2nested(text2paras(text));
Object.defineProperties(lawtext2obj, {
    "stratumRE": {value: stratumRE},
    "getStratum": {value: getStratum},
    "text2paras": {value: text2paras},
    "arr2nested": {value: arr2nested}
});
}

if(typeof module === 'object') module.exports = lawtext2obj;
//export default lawtext2obj;
/*
    如果改成 ES6 方式：
    * 前端瀏覽器的引用方法需改用 <script type="mode" src="lawtext2obj.js"></script>
    * Chrome 外掛需將本檔列在 web_accessible_resources ，再用 content_scripts 列的檔案去引入，參閱：
      * https://stackoverflow.com/questions/48104433/how-to-import-es6-modules-in-content-script-for-chrome-extension/48121629#48121629
      * https://medium.com/front-end-hacking/es6-modules-in-chrome-extensions-an-introduction-313b3fce955b
*/
