const lawtext2obj = (text, options) => {
    console.log("lawtext2obj");
    return [];
};

if(typeof module === 'object') module.exports = module.exports = lawtext2obj;
//export default lawtext2obj;
/* 
    如果改成 ES6 方式：
    * 前端瀏覽器的引用方法需改用 <script type="mode" src="lawtext2obj.js"></script> 
    * Chrome 外掛需將本檔列在 web_accessible_resources ，再用 content_scripts 列的檔案去引入，參閱：
      * https://stackoverflow.com/questions/48104433/how-to-import-es6-modules-in-content-script-for-chrome-extension/48121629#48121629
      * https://medium.com/front-end-hacking/es6-modules-in-chrome-extensions-an-introduction-313b3fce955b
*/
