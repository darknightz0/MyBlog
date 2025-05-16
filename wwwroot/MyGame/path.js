var path={
    "image-default":"resource/image/default.jpg",
    "image-設定":"resource/image/setting.png",
    "image-封面":"resource/image/封面.png",
    "image-幽影之潭":"resource/image/幽影之潭.jpeg",
    "image-人與靈的裂痕":"resource/image/人與靈的裂痕.jpeg",
    "image-森林中心":"resource/image/森林中心.png",
    "image-封印聖壇":"resource/image/封印聖壇.png",
    "image-焦土":"resource/image/焦土.jpeg",
    "image-微弱":"resource/image/微弱.jpeg",
    "image-重生":"resource/image/重生.jpeg",
    "image-黑光迷宮":"resource/image/黑光迷宮.jpeg",
    "image-封印":"resource/image/封印.jpeg",
    "image-幻化":"resource/image/幻化.jpeg",
    "image-有朝一日":"resource/image/有朝一日.jpeg",
    "image-繁星":"resource/image/繁星.jpeg",
    "image-平凡":"resource/image/平凡.jpeg",
    "image-守護者":"resource/image/守護者.jpeg",
    "image-回去":"resource/image/回去.jpeg",
    "image-記錄":"resource/image/記錄.jpeg",

    "icon-麵包":"resource/image/bread.png",
    "icon-幸運草":"resource/image/clover.png",
    "icon-靈動碎片":"resource/image/靈動碎片.png",
    "icon-箭頭右":"resource/image/arrow-right.png",
    "icon-箭頭左":"resource/image/arrow-left.png",
    "icon_arrow":"resource/image/arrow_icon.png",

    "序章":"resource/image/序章.png",
    "村莊":"resource/image/村莊.png",
    "農田":"resource/image/農田.jpeg",
    "麵包坊":"resource/image/麵包坊.jpeg",
    "小路":"resource/image/小路.jpeg",
    "石板":"resource/image/石板.jpeg",
    "村長":"resource/image/村長.jpeg",
    "告別":"resource/image/告別.jpeg",
    "迷霧森林":"resource/image/迷霧森林.jpeg",
    

    "music-序章":"resource/music/bgm.mp3",
    "music-村莊":"resource/music/村莊.mp3",
    "music-森林":"resource/music/森林.mp3",
    "music-聖壇":"resource/music/聖壇.mp3",
    "music-失敗":"resource/music/失敗.mp3",
    "music-普通":"resource/music/普通.mp3",
    "music-完美":"resource/music/完美.mp3",
    

    "effect-default":"resource/effect/default.wav"
};
for(let i in path){
    path[i]="/MyGame/"+path[i];
}
/**
 * @param {string} pathName 
 * @returns {string} css url string
 */
function url(pathName){
    return "url("+path[pathName]+")";
}
/**
 * @param {number} r 0~255
 * @param {number} g 0~255
 * @param {number} b 0~255
 * @returns {string} css rgb string
 */
function rgb(r,g,b){
    return `rgb(${r},${g},${b})`;
}
/**
 * @param {number} r 0~255
 * @param {number} g 0~255
 * @param {number} b 0~255
 * @param {number} a 0.0~1.0
 * @returns {string} css rgba string
 */
function rgba(r,g,b,a){
    return `rgba(${r},${g},${b},${a})`;
}
/**
 * @param {HTMLElementTagNameMap} tagName 
 * @param {string} className 
 * @returns {HTMLElement}
 */
function createElement(tagName,className=""){
    var e=document.createElement(tagName);
    e.className=className;
    return e;
}
/**
 * 
 * @param  {...string} JSFile 
 */
function includeJS(...JSFile){
    addEventListener("load",()=>{
        JSFile.forEach((f)=>{
            var s=document.createElement("script");
            s.src=f;
            document.head.appendChild(s);
        })
    })
}