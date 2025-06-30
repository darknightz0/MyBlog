/**
 * @param {string} pathName 
 * @returns {string} css url string
 */
function url(pathName){
    return "url("+pathName+")";
}
/**
 * @param {HTMLElement} contain 
 * @param  {...HTMLElement} element 
 */
function addHtmlChildren(contain,...element){
    element.forEach(e=>contain.appendChild(e));
}
/**
 * @param {HTMLElement} contain 
 * @param  {HTMLElement[]} element 
 */
function addHtmlChildArray(contain,element){
    element.forEach(e=>contain.appendChild(e));
}
/**  
 * @param {HTMLElement} element 
 * @param  {...string} className 
*/
function addClassName(element,...className){
    var str="";
    className.forEach(n=>str=str+" "+n);
    element.className=element.className+str;
}
/**
 * @param {number} r 0~255
 * @param {number} g 0~255
 * @param {number} b 0~255
 * @param {string} pos 所在位置
 * @returns {string} css rgb string
 */
function rgb(r,g,b,pos=""){
    return `rgb(${r},${g},${b}) ${pos}`;
}
function DayInWeek(n){
    var d=["日","一","二","三","四","五","六"];
    return d[n];
}
/**
 * @param {HTMLElement} e 
 * @param {string} dir 
 * @param  {string[]} color rgb()
 */
function gradient(e,dir,...color){
    var str="linear-gradient(to "+dir;
    color.forEach(el=>str=str+","+el);
    e.style.backgroundImage=str;
}
/**
 * @param {number} r 0~255
 * @param {number} g 0~255
 * @param {number} b 0~255
 * @param {number} a 0.0~1.0
 * @param {string} pos 所在位置
 * @returns {string} css rgba string
 */
function rgba(r,g,b,a,pos=""){
    return `rgba(${r},${g},${b},${a}) ${pos}`;
}
Date.re="";
Date.prototype.addDate=function(dd){
    this.setDate(this.getDate()+dd);
    return this;
}

Date.prototype.addYear=function(yyyy){
    this.setFullYear(this.getFullYear()+yyyy);
    return this;
}
Date.prototype.addMonth=function(MM){
    this.setMonth(this.getMonth()+MM);
    return this;
}
class Data{
    /**@type {Map<string,CartDto>} */
    static cart=new Map();
    /**
     * @template T
     * @param {string} source 
     * @param {Map<string,T>} target Data 的Map屬性
     * @param {(Dto:T)=>string} key
     * * @param {()=>void} resCallback
     */
    static read(source,target,key,resCallback=()=>{}){
        fetch(source,{method:"GET"}).then(res=>res.json()).then(res=>{
            res["data"].forEach(e=>target.set(key(e),e));
            resCallback();
        })
    }
}

class CartDto{
    name;
    number;
    icon;
    price;
    productId;
    /**@type {RightCartItem} */
    rightCartItem;
    /**@type {CartItem} */
    CartItem
}
class Cookie{
    /** 
    * @type {Map<string,string>}
    */
    static #cookieMap;
    static init(){
        this.#cookieMap=new Map(document.cookie.split("; ").map((n)=>n.split("=")));
        this.list();
    }
    static list(){
        console.log(this.#cookieMap);
    }
    static setDays(key, value, days){
        var dt=new Date().addDate(days);
        document.cookie =  key + "=" + value +"; expires="+(dt.toUTCString())+"; path=/";
        this.#cookieMap.set(key, value);
    }
    /**
     * @param {*} key 
     * @param {*} value 
     * @param  {...number} date yyyy MM dd HH mm ss
     */
    static setDate(key, value, ...date){
        var dt=new Date();
        switch (date.length) {
            case 6:
                dt.setSeconds(date[5]);
            case 5:
                dt.setMinutes(date[4]);
            case 4:
                dt.setHours(date[3]);
            case 3:
                dt.setDate(date[2]);
            case 2:
                dt.setMonth(date[1]-1);
            case 1:
                dt.setFullYear(date[0]);
                break;
            default:
                break;
        }
        document.cookie =  key + "=" + value +"; expires="+(dt.toUTCString())+"; path=/";
        this.#cookieMap.set(key, value);
    }
    /** 
     * @param {string} name 
     * @returns {boolean } 
     */
    static exist(name){
       return this.#cookieMap.has(name);
    }
    /** 
     * @param {string} name 
     * @returns {string | undefined } 
     */
    static get(name){
        return  this.#cookieMap.get(name);
    }
    static delete(key){
        var dt=new Date();
        dt.setTime(dt.getTime()-1);
        if(this.#cookieMap.has(key)){
            console.log(key+":"+this.#cookieMap.get(key)+" 已刪除");
            this.#cookieMap.delete(key);
            document.cookie=key+"=; expires="+(dt.toUTCString())+"; path=/";
        }
        else{
            console.log("沒有 "+key+" cookie");
        }
    }
}
Cookie.init();
class DropList {
    constructor() {
        this.title=document.createElement("div");
        this.title.style.border="initial";
        this.title.textContent="我是自動下拉選單";
        this.title.className="DropList option";
        this.contain=document.createElement("div");
        this.contain.className="DropList contain";
        this.#list=document.createElement("div");
        this.#list.className="DropList list";
        this.#list.style.display="none";
        
        addHtmlChildren(this.contain,this.title,this.#list);
         
        this.contain.onmouseenter=()=>{
            if(this.#list.style.display=="none"&&!this.#playing){
                this.#playing=true;
                gsap.fromTo(this.#list,{display:"block",top:"125%",opacity:0},{top:"100%",opacity:1,duration:0.4,onComplete:()=>this.#playing=false});
            }
        };
        this.contain.onmouseleave=()=>{
            if(!this.#playing){
                this.#playing=true;
                gsap.fromTo(this.#list,{top:"100%",opacity:1},
                    {top:"125%",display:"none",opacity:0,duration:0.25,onComplete:()=>this.#playing=false});
            }        
        };
        this.title.onclick=()=>{
            if(!this.#playing){
                this.#playing=true;
                if(this.#list.style.display=="none")
                    gsap.fromTo(this.#list,{display:"block",top:"125%",opacity:0},{top:"100%",opacity:1,duration:0.4,onComplete:()=>this.#playing=false});
                else{
                    gsap.fromTo(this.#list,{top:"100%",opacity:1},
                    {top:"125%",display:"none",opacity:0,duration:0.25,onComplete:()=>this.#playing=false});
                }
            }   
        };
    }
    #playing=false;
    /**@type {HTMLDivElement} */
    title;
    /**@type {HTMLDivElement} */
    #list;
    /**@type {HTMLDivElement[]} */
    options;
    /**@type {HTMLDivElement} */
    contain;
    /**
     * @param {string[]} str
     */
    addStringOptions(str){
        this.options=[];
        for (let i = 0; i < str.length; i++) {
            const div=document.createElement('div');
            this.options[i] = document.createElement('div');
            this.options[i].className="DropList option";
            this.options[i].appendChild(div);
            div.className="textEdge";
            div.textContent=str[i];
            
        }
        addHtmlChildArray(this.#list,this.options);
    }
    /**
     * @param {HTMLAnchorElement[]} a 
     * @param {string[]} str 
     * @param {string} title
     */
    addAnchorOptions(a,str,title){
        this.title.textContent=title;
        this.addStringOptions(str);
        for (let i = 0; i < a.length; i++){
            this.options[i].onclick=()=>{
                a[i].click();
            }
            a[i].style.display="none";
        }
        
        a[0].parentElement.appendChild(this.contain);
    }
}
class ShineBox{
    constructor(){
        window.addEventListener("load",()=>{
            document.body.appendChild(this.contain);
        })
        this.main.className="ShineBox txt";
        //this.main.textContent="測試";
        this.contain.className="ShineBox contain";
        this.light.className="ShineBox light";
        this.bg1.className="ShineBox bg";
        this.bg2.className="ShineBox bg";
        addHtmlChildren(this.contain,this.main,this.bg1,this.bg2,this.light);
        this.setbg("right",rgb(243, 6, 6),rgb(243, 132, 6),rgb(243, 231, 6),rgb(38, 174, 3),rgb(2, 236, 240),rgb(3, 106, 201),rgb(128, 3, 201)); 
    }
    /**@type {HTMLDivElement}*/
    contain=document.createElement("div");
    /**@type {HTMLDivElement}*/
    light=document.createElement("div");
    /**@type {HTMLDivElement}*/
    main=document.createElement("div");
    /**@type {HTMLDivElement}*/
    bg1=document.createElement("div");
    /**@type {HTMLDivElement}*/
    bg2=document.createElement("div");
    #durationX;
    #durationY;
    speedBD=2;
    durationLight=2;

    play(){
      
        gsap.fromTo(this.light,{left:"0%",top:"-200%",display:"block"},
            {left:"100%",top:"-100%",display:"none",duration:this.durationLight,repeat:-1,repeatDelay:this.durationLight/2});
         
        gsap.to(this.contain,{backgroundPositionX:"-100%",duration:this.durationLight,ease:"none",repeat:-1});
        this.setSpeed();
        gsap.timeline({repeat:-1})
        .fromTo(this.bg1,{left:"-10%",bottom:"50%",display:"block"},{left:"0%",duration:this.#durationX*10,ease:"none"})
        .to(this.bg1,{bottom:"90%",duration:this.#durationY*40,ease:"none"})
        .to(this.bg1,{left:"95%",duration:this.#durationX*95,ease:"none"}) 
        .to(this.bg1,{bottom:"50%",duration:this.#durationY*40,ease:"none"})   
        .to(this.bg1,{left:"110%",duration:this.#durationX*10,ease:"none",onComplete:this.setSpeed.bind(this)})
        
        gsap.timeline({repeat:-1})
        .fromTo(this.bg2,{left:"-10%",top:"50%",display:"block"},{left:"0%",duration:this.#durationX*10,ease:"none"})
        .to(this.bg2,{top:"90%",duration:this.#durationY*40,ease:"none"})
        .to(this.bg2,{left:"95%",duration:this.#durationX*95,ease:"none"}) 
        .to(this.bg2,{top:"50%",duration:this.#durationY*40,ease:"none"})   
        .to(this.bg2,{left:"110%",duration:this.#durationX*10,ease:"none",onComplete:this.setSpeed.bind(this)})
    }
    setSpeed(speed=this.speedBD){
        this.speedBD=speed;
        this.#durationX=this.speedBD/100;
        this.#durationY=this.#durationX*this.contain.offsetHeight/this.contain.offsetWidth;
    }
    
    setbg(dir,...color){
        var str="";
        color.forEach(el=>str=str+","+el);
        str=str+str;
        str="linear-gradient(to "+dir+str;
        str=str+","+color[0];

        this.contain.style.backgroundImage=str
    }
}

class MoveBackground{
    /**
     * @param {string} src 
     */
    constructor(src){
        this.contain=document.createElement("div");
        this.contain.className="MoveBackground contain";
        this.#bg1=document.createElement("div");
        this.#bg1.className="MoveBackground bg";
        this.#bg2=document.createElement("div");
        this.#bg2.className="MoveBackground bg";
        this.#bg2.style.rotate= "y 180deg";
        this.setbg(src);
        addHtmlChildren(this.contain,this.#bg1,this.#bg2);
        addEventListener("load",()=>{
            document.body.appendChild(this.contain);
        })
         /*
        this.#s1=gsap.timeline({paused:true}).call(()=>{
            this.#s2.play(0);
        },[],this.speed/2)
        .fromTo(this.#bg1,{left:"100%"},
            {left:"-100%",duration:this.speed,ease:"none"},"0");
        this.#s2=gsap.timeline({paused:true}).call(()=>{
            this.#s1.play(0);
        },[],this.speed/2)
        .fromTo(this.#bg2,{left:"100%"},
            {left:"-100%",duration:this.speed,ease:"none"},"0");
        

        this.#s1.play(this.speed/2);
        */
       var f=this.speed/2;
        gsap.timeline({repeat:-1})
        .fromTo(this.#bg1,{left:"0%"},{left:"-100%",duration:f,ease:"none"},"0")
        .fromTo(this.#bg2,{left:"100%"},{left:"0%",duration:f,ease:"none"},"0")
        .fromTo(this.#bg1,{left:"100%"},{left:"0%",duration:f,ease:"none"},f.toString())
        .fromTo(this.#bg2,{left:"0%"},{left:"-100%",duration:f,ease:"none"},f.toString());
    }
    
    /**@type {HTMLDivElement} */
    contain;
    /**@type {HTMLDivElement} */
    #bg1;
    /**@type {HTMLDivElement} */
    #bg2;
    #s1;
    #s2;
    /**@type {number} */
    speed=600;
    setbg(src){
        this.#bg1.style.backgroundImage=url(src);
        this.#bg2.style.backgroundImage=url(src);
    }
}
class TextColor{
    /**
     * @param {string} txt 
     * @param {string} innerColorString css color()
     * @param {string} edgeColorString css color()
     */
    constructor(str="",innerColorString="rgb(0,0,0)",edgeColorString="rgb(255,255,255)"){
        this.contain.className="TextColor contain";
        this.edge.className="TextColor edge";
        this.main.className="TextColor main";
        gradient(this.edge,"right",edgeColorString) ;
        gradient(this.main,"right",innerColorString) ;
        this.setText(str);
        addHtmlChildren(this.contain,this.edge,this.main);
    }
    /**@type {HTMLDivElement}*/
    edge=document.createElement("div");
    /**@type {HTMLDivElement}*/
    main=document.createElement("div");
    /**@type {HTMLDivElement}*/
    contain=document.createElement("div");
    setText(str){
        this.main.textContent=str;
        this.edge.textContent=str;
    }
}
class StarRating{
    /**
     * @param {number} maxValue 
     * @param {number} type (0 固定)、(1 評價)
     */
    constructor({maxValue=5,type=0,currentRating=0}={}){
        this.init({maxValue:maxValue,type:type,currentRating:currentRating});  
        this.contain.className="StarRating contain";
    }
    /**
     * @param {number} maxValue 
     * @param {number} type (0 固定)、(1 評價)
     */
    init({maxValue=5,type=0,currentRating=0}={}){
        this.currentRating=currentRating;
        this.maxValue=maxValue;
        this.stars=[];
        var div;
        this.contain.replaceChildren();
        for(var i=1;i<=this.maxValue;i++){
            div=new TextColor("★");
            //☆★
            div.main.setAttribute("rating",i.toString());
            addHtmlChildren(this.contain,div.contain);
            this.stars.push(div.main);
        }
        switch (type) {
            case 0:
                this.#set(this.currentRating);
                break;
            case 1:
                this.#setCallback();
                break;
            default:
                break;
        }
    }
    /**@type {number} read only*/
    maxValue;
    currentRating=0;
    /**@type {HTMLDivElement} */
    contain=document.createElement("div");
    /**@type {HTMLDivElement[]} */
    stars=[];
    /**
     * @param {number} rating 
     */
    #set(rating){
        this.stars.forEach(star => {
            star.removeAttribute("style");
            star.classList.toggle('hover', star.getAttribute('rating') <= rating);
            star.classList.toggle('selected', star.getAttribute('rating') <= this.currentRating);
        });
        var ind=Math.floor(rating);
        if(rating<this.maxValue&&ind!=rating){
            rating=(rating-ind)*100;
            gradient(this.stars[ind],"right",rgb(255, 215, 0,rating.toString()+"%"),rgb(155, 155, 155,(100-rating).toString()+"%"));
        }
        
    }
    #setCallback(){
        this.stars.forEach(star => {
        star.onmouseenter= () => {
            const val = parseFloat(star.getAttribute('rating'));
            this.#set(val);
        };
        star.onmouseleave= () => {
            this.#set(this.currentRating);
        };

        star.addEventListener('click', () => {
            this.currentRating = parseFloat(star.getAttribute('rating'));
            this.#set(this.currentRating);
            });
        });
        this.#set(this.currentRating);
    }
}
class PriceLabel{
    /**
     * @param {number} price 
     * @param {object} param1
     * @param {string} [param1.unit]
     * @param {number | string | null} [param1.priceOrigin]
     */
    constructor(price,{unit="NT$",priceOrigin=null}={}){
        this.setPrice(price);
        this.#unit.textContent=unit;
        this.#priceOriginTitle.textContent="定價:";
        this.setPriceOrigin(priceOrigin);
        addHtmlChildren(this.contain,this.#unit,this.#price,this.#priceOriginContain);
        addHtmlChildren(this.#priceOriginContain,this.#priceOriginTitle,this.#priceOrigin);
        this.contain.className="PriceLabel contain";
        this.#unit.className="PriceLabel unit";
        this.#price.className="PriceLabel price";
        this.#priceOriginContain.className="PriceLabel priceOriginContain";
        this.#priceOrigin.className="PriceLabel priceOrigin";
    }
    contain=document.createElement("div");
    #unit=document.createElement("div");
    #price=document.createElement("div");
    #priceOriginContain=document.createElement("div");
    #priceOriginTitle=document.createElement("div");
    #priceOrigin=document.createElement("div");
    /**
     * @param {number | string} n 
     * @returns {string} 123456->123,456
     */
    #priceFormat(n){
        var strn="";
        if(typeof(n)=="number")
            strn=n.toString();
        strn=strn.split('').reverse().join('');
        var str="";
        var i=0;
        for(i=0;i<strn.length-3;i+=3){
            str+=strn.substring(i,i+3)+","
        }
        str+=strn.substring(i,strn.length)
        return str.split('').reverse().join('');
    }
    setPrice(price){
        this.#price.textContent=this.#priceFormat(price);
    }
    /**
     * @param {number | string | null} price 
     */
    setPriceOrigin(price){
        if(price!=null){
            this.#priceOriginContain.style.display="flex";
            this.#priceOrigin.textContent=this.#unit.textContent+this.#priceFormat(price);
        }
        else{
            this.#priceOriginContain.style.display="none";
        }
    }
}
class ItemBlock{
    /** 
     * @param {string} img path 
     * @param {string} title 
     * @param {number} price
     * @param {object} param3
     * @param {number} [param3.type] 1~1
     * @param {string} [param3.priceUnits] 1~1
     * @param {number | null} [param3.priceOrigin] 
     * @param {()=>{}} [param3.clickCallback] 
     * @param {()=>{}} [param3.cartCallback] 
     */
    constructor(img,title,price,{type=1,unit="NT$",priceOrigin=null,clickCallback=()=>{},cartCallback=()=>{}}={}){
        this.clickCallback=clickCallback;
        this.cartCallback=cartCallback;
        this.image.src=img;
        this.title.textContent=title;
        this.price=new PriceLabel(price,{priceOrigin:priceOrigin,unit:unit});
        this.car.textContent="新增至購物車";
        addHtmlChildren(this.#box,this.title,this.starRating.contain,this.price.contain,this.#discount,
        this.#freeDeliverDate,this.#destination,this.car);
    
        addHtmlChildren(this.contain,this.image,this.#box);
        switch (type) {
            case 1:
                this.type1();
                break;
        
            default:
                break;
        }
        this.price.contain.onclick=this.clickCallback;
        this.title.onclick=this.clickCallback;
        this.image.onclick=this.clickCallback;
        this.car.onclick=this.cartCallback;
    }
    #box=document.createElement("div");
    starRating=new StarRating();
    contain=document.createElement("div");
    image=document.createElement("img");
    title=document.createElement("div");
    /**@type {PriceLabel} */
    price;
    /**@type {()=>} */
    clickCallback;
    /**@type {()=>} */
    cartCallback;
    #discount=document.createElement("div");
    #freeDeliverDate=document.createElement("div");
    #destination=document.createElement("div");

    car=document.createElement("div");
    /**
     * @param {Object} param1
     * @param {number|null} [param1.discount] 
     * @param {Date|null} [param1.freeDeliverDate] 
     * @param {string|null} [param1.destination] 
     */ 
    feature({discount=null,freeDeliverDate=null,destination=null}={}){
        /** undone
        if(discount==null)
            this.#discount.textContent="";
        else
            this.#discount.textContent="";
        */
       
        if(freeDeliverDate==null)
            this.#freeDeliverDate.textContent="";
        else
            this.#freeDeliverDate.textContent="免運費"+(freeDeliverDate.getMonth()+1)+"月"+freeDeliverDate.getDate()+"日 " 
        +"周"+DayInWeek(freeDeliverDate.getDay());
        if(destination==null)
            this.#destination.textContent="";
        else
            this.#destination.textContent="運送地區:"+destination;

    }
    type1(){
        this.#box.className="ItemBlock box type1";
        this.contain.className="ItemBlock contain type1";
        this.image.className="ItemBlock image type1";
        this.title.className="ItemBlock title type1";

        this.car.className="ItemBlock car type1";
    }
}
class PageButton{
    /**
     * @param {number} maxDisplay 
     * @param {number} maxPage 
     * @param {number} nowPage 
     * @param {boolean} HttpReqest 
     * @param {(n:number)=>} HttpCallback 
     */
    constructor(maxDisplay,maxPage=null,nowPage=1,HttpReqest=false,HttpCallback){
        this.maxPage=maxPage;
        this.contain.className="PageButton contain";
        this.center.className="PageButton contain";
        this.left.textContent="<";
        this.right.textContent=">";
        this.HttpCallback=HttpCallback;
        if(HttpReqest){
            this.right.onclick=()=>{
                this.HttpCallback((this.nowPage==this.maxPage)?this.maxPage:this.nowPage+1);
            };
            this.left.onclick=()=>{
                this.HttpCallback((this.nowPage==1)?1:this.nowPage-1);
            };
        }
        else{
            this.right.onclick=()=>{
            this.setNowPage(this.nowPage+1);
            };
            this.left.onclick=()=>{
                this.setNowPage(this.nowPage-1);
            };
        }
        
        addHtmlChildren(this.contain,this.left,this.center,this.right);
        this.setMaxDisplay(maxDisplay,HttpReqest);
        this.setNowPage(nowPage);
    }
    nowPage=1;
    maxPage=null;
    /**@type {TextColor[]}*/
    button=[];
    left=document.createElement("div");
    right=document.createElement("div");
    center=document.createElement("div");
    contain=document.createElement("div");
    /**@type {number} int*/
    maxDisplay=0;
    /**@type {(number)=>} */
    HttpCallback;
    setMaxDisplay(n,HttpReqest=false){
        this.maxDisplay=n;
        this.button=[];
        for (let i = 0; i <n; i++) {
            var div=new TextColor();
            div.contain.className=div.contain.className+" PageButton button";
            this.button.push(div);
            if(HttpReqest){
                div.main.onclick=(event)=>{
                    this.HttpCallback(parseInt(event.target.textContent));
                }
            }
            else{
                div.main.onclick=(event)=>{
                this.setNowPage(event.target.textContent);
                }
            }
            
            addHtmlChildren(this.center,div.contain);
        }
        
    }
    setNowPage(n){
        if(typeof(n)=="string")
            n=parseInt(n);
        if(n<=0)
            n=1;
        else if(this.maxPage != null &&n>this.maxPage)
            n=this.maxPage;
        this.nowPage=n;
        var a=this.#PageInlude(n);
        
        for (let i = 0; i < this.button.length; i++) {
           this.button[i].setText(a[i]);
           this.button[i].contain.classList.toggle("selected",this.button[i].main.textContent==n);
        }
    }
    /**
     * 
     * @param {number} n 
     * @param {number} max 
     * @returns {number[]}
     */
    #PageInlude(n){
        var a=[];
        var v=Math.floor(this.maxDisplay/2);
        var l=v+n;
        var k=(this.maxDisplay%2==1)?-v+n:-v+n+1;
        var zero=0;
        if(k<=0){
            l=l+Math.abs(k)+1;
            k=1;
        }    
        if(this.maxPage != null &&l>this.maxPage){
            k=k-l+this.maxPage;
            l=this.maxPage;
        }
        if(k<=0){
            zero=-k+1;
            k=1;
        }
        for (let i = k; i <= l; i++) {
            a.push(i);
        }
        for (let i = 0; i <= zero; i++) {
            a.push("");
        }
        return a;
    }
    
}
class ListMessage{
    constructor(txt) {
        this.contain.className="ListMessage contain";
        this.txt.className="ListMessage txt";
        this.icon.className="ListMessage icon";
        this.icon.textContent="X";
        this.icon.title="刪除";
        this.icon.onclick=this.#delete.bind(this);
        this.txt.textContent=txt;
        addHtmlChildren(this.contain,this.txt,this.icon);
    }
    contain=document.createElement("div");
    txt=document.createElement("div");
    icon=document.createElement("div");
    deleteCallback=()=>{};
    
    #delete(){
        this.deleteCallback();
        this.contain.parentElement.removeChild(this.contain);
    }
}
class OptDiv{
    /**
     * @param {object} param0 
     * @param {string | HTMLElement} param0.title
     * @param {string | HTMLElement} param0.content 
     */
    constructor({title="",content=""}){
        this.#title.append(title);
        this.#content.append(content);
        this.contain.className="OptDiv contain";
    }
    contain=document.createElement("div");
    #title=document.createElement("div");
    #content=document.createElement("div");
    /**
     * @param {boolean} bt 
     */
    selected(bt){
        this.contain.classList.toggle("selected",bt);
    }
}
//商品個別詳細頁面        
class ProductPage{
    //{string? Id,string name,int number,int price,string path,Jsonstring Feature} 
    /**
     * @param {object} data
     * @param {string} [data.name] 
     * @param {number} [data.number]
     * @param {string} [data.price]
     * @param {string} [data.path]
     * @param {string[]} [data.FeatureObj]
     */ 
    constructor(data){
        this.image.src=data.path;
        this.title.textContent=data.name;
        this.price=new PriceLabel(data.price);
        this.price.contain.style.cursor="unset";
        this.contain.className="ProductPage contain";
        this.section1.className="ProductPage section1";
        this.section2.className="ProductPage section2";
        this.section3.className="ProductPage section3";
        this.image.className="ProductPage image";
        this.title.className="ProductPage title";
        this.content.className="ProductPage content";
        addHtmlChildren(this.contain,this.section1,this.section2,this.section3);
        addHtmlChildren(this.section1,this.image);
        addHtmlChildren(this.section2,this.title,this.star.contain,document.createElement("hr"),this.price.contain
        ,this.content);
        var t =document.createElement("h4");
        t.textContent="關於此商品";
        var li=document.createElement("ul");
        addHtmlChildren(this.content,t,li);
        data.FeatureObj.forEach(e=>{
            var el=document.createElement("li");
            el.textContent=e;
            li.appendChild(el);
        })
    }
    contain=document.createElement("div");
    section1=document.createElement("div");
    section2=document.createElement("div");
    section3=document.createElement("div");
    image=document.createElement("img");
    title=document.createElement("h2");
    content=document.createElement("div");
    star=new StarRating();
    /**@type {PriceLabel} */
    price;
}
class InfoDiv{
    /**
     * @param {string} title 
     * @param {string} subtitle 
     * @param {string[]} listTitle 
     * @param {string[]} value 
     * @param {string[]} link 
     */
    constructor(title,subtitle,listTitle,value,link){
        this.contain.className="InfoDiv contain";
        this.title.className="InfoDiv title";
        this.subtitle.className="InfoDiv subtitle";
        this.title.textContent=title;
        this.subtitle.textContent=subtitle;
        this.setList(listTitle,value,link);
    }
    contain=document.createElement("div");
    title=document.createElement("div");
    subtitle=document.createElement("div");
    /**
     * @param {string[]} title 
     * @param {string[]} value 
     * @param {string[]} link 
     */
    setList(title,value,link=[]){
        this.contain.replaceChildren();
        addHtmlChildren(this.contain,this.title,this.subtitle);
        for(let i=0;i<title.length;i++){
            var div=document.createElement("div");
            var t=document.createElement("div");
            var v=document.createElement("div");
            var ic=document.createElement("div");
            div.className="InfoDiv list";
            t.className="InfoDiv listTitle";
            v.className="InfoDiv listValue";
            t.append(title[i]);
            v.append(value[i]);
            ic.textContent=">";
            div.onclick=()=>{
                window.location.href=link[i];
            }
            addHtmlChildren(div,t,v,ic);
            var hr=document.createElement("div");
            hr.className="InfoDiv hr";
            addHtmlChildren(this.contain,div,hr);
            if(i==title.length-1)
                hr.style.display="none";
        }
    }
}
class UserIcon{
    /**
     * @param {object} data
     * @param {string} [data.icon]
     * @param {string} [data.displayName]
     * @param {string} [data.email]
     */
    constructor(data){
        addEventListener('click', (event)=> {
            if (!this.contain.contains(event.target)) {
                this.list.style.display="none";
            }
        });
      this.icon.onclick=()=>{
        if (this.list.style.display=="flex"){
            this.list.style.display="none";
        }
        else
        this.list.style.display="flex";
      };
      addHtmlChildren(this.contain,this.icon,this.list);
      this.icon.src=data.icon??"/MyImage/icon.jpg";
      this.icon.title="我的帳戶\n"+data.displayName+"\n"+data.email;
      var div=document.createElement("div");
      div.textContent=data.email;
      this.name.textContent=data.displayName+"，你好";
      addHtmlChildren(this.list,div,this.icon.cloneNode(),this.name,this.bt,this.logOut)
      this.contain.className="UserIcon contain";
      this.icon.className="UserIcon icon";
      this.list.className="UserIcon list";
      this.bt.className="UserIcon manage";
      this.bt.textContent="管理我的帳戶";
      this.logOut.className="UserIcon manage";
      this.logOut.textContent="登出";
    }
    contain=document.createElement("div");
    icon=document.createElement("img");
    list=document.createElement("div");
    name=document.createElement("div");
    bt=document.createElement("div");
    logOut=document.createElement("div");
}
//右側購物車
class RightCart{
    static contain=document.createElement("div");
    static title=document.createElement("div");
    static item=document.createElement("div");
    static total=new PriceLabel(0);
    
    static turn(bt){
        if(bt){
            this.containL.classList.toggle("RightCartSide",true);
            this.contain.style.display="flex";
        }
        else{
            this.containL.classList.toggle("RightCartSide",false);
            this.contain.style.display="none";
        }
    }
    static init(){
        this.containL=document.getElementsByClassName("main")[0];
        
            document.body.appendChild(this.contain);
        
        var div=document.createElement("div");
        div.textContent="小計";
        var bt=document.createElement("div");
        bt.textContent="前往購物車";
        bt.className="bt";
        bt.onclick=()=>{
            window.location.href="/Shop/Cart";
        }
        addHtmlChildren(this.title,div,this.total.contain,bt);
        addHtmlChildren(this.contain,this.title,this.item);
        
        this.contain.className="RightCart contain";

        Data.cart.forEach(e=>{
            this.addItem(e);
        });    
    }
    /**@type {HTMLElement} */
    static containL;

    static #sum=0;
 
    /**
     * @param {CartDto} data*/
    static addItem(data){
        var c=Data.cart.get(data.productId);
        if(c==undefined||c.rightCartItem==undefined){
            data.rightCartItem=new RightCartItem(data,(ind)=>{
              return fetch("/Shop/CartAdd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "ProductId": data.productId, "Number": ind })
            }).then((res)=>{
                this.addItem({productId:data.productId,number:ind,price:data.price})//重複觸發
                return res.ok;
            });
            },()=>{
                window.location.href="/Shop/Product/"+data.productId;
            });
            this.contain.appendChild(data.rightCartItem.contain);
            Data.cart.set(data.productId,data);
        }
        else{
            c.rightCartItem.bt.set(data.number);//重複觸發
           
            c.number=data.number;
            Data.cart.set(c.productId,c);
        }
        if(Data.cart.get(data.productId).number==0){
           delete Data.cart.delete(data.productId);
        }
        this.#sum=0;
        Data.cart.forEach((e)=>{
            this.#sum+=e.number*e.price;
        })
        this.total.setPrice(this.#sum);
    }
}

class RightCartItem{
    /**
     * @param {object} data
     * @param {number} data.number
     * @param {string} data.icon
     * @param {number} data.price
     * @param {(ind:number)=>boolean} changeCallback
     * @param {()=>} clickCallback
     */
    constructor(data,changeCallback,clickCallback){
        this.price=new PriceLabel(data.price);
        this.image.src=data.icon;
        this.image.onclick=clickCallback;
        this.bt=new LRListCart(changeCallback,()=>{
            if(this.contain.parentElement!=null)//重複觸發 set與delete
            this.contain.parentElement.removeChild(this.contain);
        })
        this.bt.set(data.number);
        addHtmlChildren(this.contain,this.image,this.price.contain,this.bt.contain);
        this.contain.className="RightCartItem contain";
    }
    contain=document.createElement("div");
    image=document.createElement("img");
    /**@type {PriceLabel} */
    price;
    /**@type {LRListCart} */
    bt;
}
class LRListCart{
    contain=document.createElement("div");
    /**@type {(ind:number)=>boolean} */
    changeCallback;
    /**@type {()=>} */
    deleteCallback;
    btL=document.createElement("div");
    btR=document.createElement("div");
    /**read only*/
    number=1;
    /**@type {HTMLDivElement} */
    #txt;
    /**
     * @param {(n:number)=>} changeCallback 
     */
    constructor(changeCallback=()=>{return true;},deleteCallback=()=>{}){
        this.changeCallback=changeCallback;
        this.deleteCallback=deleteCallback;
        this.contain.className="LRListCart contain";
        this.btL.onclick=this.#change.bind(this);
        this.btL.dir=-1;
        this.btL.className="LRListCart btL";
        this.contain.appendChild(this.btL);

        this.#txt=document.createElement("div");
        this.#txt.className="LRListCart txt";
        this.contain.appendChild(this.#txt);

        this.btR.onclick=this.#change.bind(this);
        this.btR.dir=1;
        this.btR.className="LRListCart btR";
        this.contain.appendChild(this.btR);
        this.#txt.textContent="1";
        this.btL.textContent="-";
        this.btR.textContent="+";
    }
    set(n){
        if(typeof(n)=="string")
            n=parseInt(n);
        this.number=n;
        this.#test();
    }
    /**
     * @param {Event} e 
     */
    #change(e){
        /**@type {HTMLElement} */
      var tar=e.target;
        this.number+=parseInt(tar.getAttribute("dir"));
        if(this.changeCallback(this.number)==true){
            this.#test();
        }
        else{
            this.#txt.textContent="連線中...";
        }
    }
    #test(){
        if(this.number<=0){
             this.deleteCallback();
        } 
        else if(this.number==1){
            this.btL.textContent="T"
        }
        else{
            this.btL.textContent="-"
            
        }
        this.#txt.textContent=this.number;
    }
    
}
class Cart{
    static contain=document.createElement("div");
    static item=document.createElement("div");
    static total=new PriceLabel(0);
    static #quantity=document.createElement("div");
    static #sum=0;
    static init(){
        
        var div=document.createElement("div");
        div.textContent="購物車";
        div.className="Cart title";
        var div2=document.createElement("div");
        div2.textContent="定價";
        div2.className="Cart subtitle";

        addHtmlChildren(this.contain,div,div2);
        
        this.contain.className="Cart contain";
        Data.cart.forEach(e=>{
            this.addItem(e);
        }); 
        div=document.createElement("div");
        div.className="flexRow end hover";
        addHtmlChildren(div,this.#quantity,this.total.contain);
        addHtmlChildren(this.contain,div);
        var c =document.getElementsByClassName("main")[0];
        c.appendChild(this.contain);
    }
    
    
    
    /**
     * @param {CartDto} data*/
    static addItem(data){
        var c=Data.cart.get(data.productId);
        if(c==undefined||c.CartItem==undefined){
            data.CartItem=new CartItem(data,(ind)=>{
              return fetch("/Shop/CartAdd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "ProductId": data.productId, "Number": ind })
            }).then((res)=>{
                this.addItem({productId:data.productId,number:ind,price:data.price})//重複觸發
                return res.ok;
            });
            },()=>{
                window.location.href="/Shop/Product/"+data.productId;
            });
            this.contain.appendChild(data.CartItem.contain);
            Data.cart.set(data.productId,data);
        }
        else{
            c.CartItem.list.set(data.number);//重複觸發
           
            c.number=data.number;
            Data.cart.set(c.productId,c);
        }
        if(Data.cart.get(data.productId).number==0){
           delete Data.cart.delete(data.productId);
        }
        this.setTotal();
    }
    static #count;
    static setTotal(){
        this.#sum=0;
        Data.cart.forEach((e)=>{
            this.#sum+=e.number*e.price;
        })
        this.total.setPrice(this.#sum);
        this.#count=0;
        Data.cart.forEach(e=>this.#count+=e.number);
        this.#quantity.textContent="小計 ("+this.#count.toString()+" 件商品)：";
    }
}
class CartItem{
     /**
     * @param {CartDto} data
     * @param {(ind:number)=>boolean} changeCallback
     * @param {()=>} clickCallback
     */
    constructor(data,changeCallback,clickCallback){
        this.title.textContent=data.name;
        this.price=new PriceLabel(data.price);
        this.image.src=data.icon;
        this.image.onclick=clickCallback;
        this.list=new LRListCart(changeCallback,()=>{
            if(this.contain.parentElement!=null)//重複觸發 set與delete
            this.contain.parentElement.removeChild(this.contain);
        })
        addHtmlChildren(this.content,this.title,this.list.contain);
        this.list.set(data.number);
        addHtmlChildren(this.contain,this.image,this.content,this.price.contain);
        this.contain.className="CartItem contain";
        this.image.className="CartItem image";
        this.content.className="CartItem content";
    }
    contain=document.createElement("div");
    title=document.createElement("div");
    content=document.createElement("div");
    image=document.createElement("img");
    /**@type {PriceLabel} */
    price;
    /**@type {LRListCart} */
    list;
}
