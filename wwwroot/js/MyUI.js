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
 * @param {HTMLElement} e 
 * @param  {string[]} color rgb()
 */
function gradient_conic(e,...color){
    var str="conic-gradient(";
    color.forEach(el=>str=str+el+",");
    str=str.substring(0,str.length-1)+")";
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
    static main=document.createElement("div");
    static checkout=document.createElement("div");
    static #checkoutTitle=document.createElement("span");
    static #total2=new PriceLabel(0);
    static contain=document.createElement("div");
    static item=document.createElement("div");
    static total=new PriceLabel(0);
    static #quantity=document.createElement("div");
    static #bt=document.createElement("input");
    static #sum=0;
    static init(){
        this.main.className="Cart main"
        var div=document.createElement("div");
        div.textContent="購物車";
        div.className="Cart title";
        var div2=document.createElement("div");
        div2.textContent="定價";
        div2.className="Cart subtitle";

        addHtmlChildren(this.main,div,div2);
        
        this.contain.className="Cart contain";
        Data.cart.forEach(e=>{
            this.addItem(e);
        }); 
        div=document.createElement("div");
        div.className="flexRow end hover";
        addHtmlChildren(div,this.#quantity,this.total.contain);
        addHtmlChildren(this.main,div);
        var c =document.getElementsByClassName("main")[0];
        
        this.checkout.className="Cart checkout";
        addHtmlChildren(this.checkout,this.#checkoutTitle,this.#total2.contain,this.#bt);
        addHtmlChildren(this.contain,this.main,this.checkout);
        addHtmlChildren(c,this.contain);

        this.#bt.type="button";
        this.#bt.value="前往結帳";
        this.#bt.className="bt";
        this.#bt.onclick=()=>window.location.href="/Transaction/CheckOut";
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
            this.main.appendChild(data.CartItem.contain);
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
        this.#total2.setPrice(this.#sum);
        this.#count=0;
        Data.cart.forEach(e=>this.#count+=e.number);
        this.#quantity.textContent="小計 ("+this.#count.toString()+" 件商品)：";
        this.#checkoutTitle.textContent=this.#quantity.textContent;
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
//Email驗證
class ECode{
    constructor(digit,submitCallback=()=>{}){
        this.submitCallback=submitCallback;
        var div;
        for(let i=0;i<digit;i++){
            div=document.createElement("input");
            div.className="ECode div";
            div.oninput=this.#change.bind(this);
            div.onfocus=(()=>{var ind=i;var div2=div;return ()=>{this.#ind=ind;div2.value=""}})();

            this.div.push(div);
        }
        this.bt.type="button";
        this.bt.onclick=this.#submit.bind(this);
        this.bt.className="ECode submit";
        this.bt.value="驗證";

        this.contain.className="ECode contain";
        addHtmlChildArray(this.contain,this.div);
        addHtmlChildren(this.contain,this.bt);
       
    }
    contain=document.createElement("div");
    bt=document.createElement("input");
    /**@type {HTMLInputElement[]} */
    div=[];
    #ind=0;
    /**@type {(code:string)=>} */
    submitCallback;
    #submit(){
        var ep=true;
        this.div.forEach(e=>{if(ep&&e.value==""){
            e.focus();ep=false;
        }});
        if(ep){
           var str="";
            this.div.forEach(e=>str+=e.value);
            this.submitCallback(str); 
        }
    }
    #comp=false;
    #reg=/^[0-9]$/;
    /**
     * @param {InputEvent} e 
     */
    #change(e){
        
        if (e.isComposing) {
            if(this.#comp){
                if(this.#reg.test(this.div[this.#ind].value)){
                    this.#ind++;
                    (this.#ind!=this.div.length)?(this.div[this.#ind].focus()):this.bt.focus();
                }
                else{
                    this.div[this.#ind].value="";
                }
            }
            this.#comp=!this.#comp;
        return;
        }
        if(this.#reg.test(this.div[this.#ind].value)){
            this.#ind++;
            (this.#ind!=this.div.length)?(this.div[this.#ind].focus()):this.bt.focus();
        }
        else{
            this.div[this.#ind].value="";
        }
    }
}
class G1Dto{
    /**@type {HTMLElement} */
    contain;
    /**@type {()=>} */
    callback;
}
class Game_2048_1{
    /**@type {boolean} */
    static #animing;
    /**@type {()=>} */
    gameOverCallback;
    /**@type {HTMLDivElement} */
    static contain;
    /**@type {HTMLDivElement} */
    static main;
    /**@type {HTMLDivElement} */
    static addBt;
    /**@type {HTMLImageElement} */
    static #nextIcon;
    /**@type {HTMLDivElement} */
    static #nextIconN;
    /**@type {number} */
    static #next;
    /**@type {HTMLDivElement[]} */
    static block;
    /**@type {G1Dto[]} */
    static #effect;
    /**@type {G1Dto} */
    static #effect2;
    /**@type {[]} */
    static map;
    /**@type {boolean[]} */
    static #update;
    /**@type {HTMLDivElement} */
    static button;
    /**@type {[]} */
    static item;
    /**@type {HTMLDivElement} */
    static score;
    static #score=0;
    static #max=6;
    static #seed=[0,1,2];
    /**
     * @param {()=>} gameOverCallback 
     */
    static init(gameOverCallback=()=>{}){
        Music.init();
        this.#animing=false;
        this.gameOverCallback=gameOverCallback;
        this.block=[];
        this.#effect=[];
        this.map=[];
        this.#update=[];
        this.item=["/MyImage/jw-10.png","/MyImage/jw-11.png","/MyImage/jw-12.png","/MyImage/jw-1.png","/MyImage/jw-2.png","/MyImage/jw-3.png",
            "/MyImage/jw-4.png","/MyImage/jw-5.png","/MyImage/jw-6.png"
            ,"/MyImage/jw-7.png","/MyImage/jw-8.png","/MyImage/jw-13.png","/MyImage/jw-14.png"
            ,"/MyImage/jw-15.png"
        ];
        this.score=document.createElement("div");
        this.score.className="Game_2048_1 score";
        this.button=document.createElement("div");
        this.main=document.createElement("div");
        this.button.className="Game_2048_1 button";
        this.contain=document.createElement("div");
        this.contain.className="Game_2048_1 contain";
        this.addBt=document.createElement("div");
        this.addBt.className="Game_2048_1 addBt";
        this.addBt.onclick=this.add.bind(this);
        this.#nextIcon=document.createElement("img");
        this.#nextIcon.style.boxSizing="unset"
        this.#nextIconN=document.createElement("div");
        this.main.className="Game_2048_1 main";
        var str=["←","↑","↓","→"];
        var dr=[3,0,2,1];
        var c=document.createElement("div");
            c.className="flexRow";
        for(let i=0;i<2;i++){
            var e=document.createElement("div");
            e.textContent=str[i];
            e.className="Game_2048_1 bt";
            e.onclick=()=>{
                var ind=dr[i];
                this.change(ind);
            };
            c.appendChild(e);
        }
        this.button.appendChild(c);
        c=document.createElement("div");
        c.className="flexRow";
        for(let i=2;i<4;i++){
            var e=document.createElement("div");
            e.textContent=str[i];
            e.className="Game_2048_1 bt";
            e.onclick=()=>{
                var ind=dr[i];
                this.change(ind);
            };
            c.appendChild(e);
        }
        this.button.appendChild(c);
        var mc=[];
        for(let i=0;i<4;i++){
            var c=document.createElement("div");
            c.className="flexRow";
            for(let j=0;j<4;j++){
                var e=document.createElement("div");
                e.className="Game_2048_1 block";
                c.appendChild(e);
                this.block.push(e);
                this.map.push(null);
                
                var im=document.createElement("img");
                im.src="/MyImage/light.png";
                im.style.position="absolute";
                im.style.display="none";
                im.style.width="100%";
                im.style.height="100%";
                e.appendChild(im);
                var ob=new G1Dto();
                ob.contain=im;
                ob.callback=(()=>{
                    var tar=im;
                    return ()=>{
                        gsap.timeline().set(tar,{display:"block",opacity:0,onStart:()=>this.#animing=true})
                    .to(tar,{opacity:1,duration:0.175,ease:"none"}).to(tar,{opacity:0,display:"none",duration:0.175,ease:"none",onComplete:()=>this.#animing=false});
                    }
                })();
                this.#update.push(false);
                this.#effect.push(ob);



            }
            mc.push(c);
        }
        var div=document.createElement("div");
        div.textContent="配置";
        div.style.width="50%";
        addHtmlChildren(this.addBt,div,this.#nextIcon,this.#nextIconN);

        this.#addScore(0);
        var sp=new StartPage("2048合合合遊戲",()=>{
            Music.musicPlay("bgm");
            this.contain.removeChild(sp.contain);
        },"玩法說明:<br>兩個相同等級的圖案合在一起即可升一級。<br>操作說明:<br>使用方向鍵或點選按鈕。<br>挑戰:<br>！最高有14級<br>！10000分");
        var set=document.createElement("img");
        set.src="/MyImage/setting-icon.png";
        set.style.position="absolute";
        set.style.top="0";
        set.style.right="0";
        set.style.width="5%";
        set.style.height="5%";   

        set.onclick=()=>sp.settingDiv.click();
        addHtmlChildArray(this.main,mc)
        addHtmlChildren(this.contain,this.score,this.main,this.button,this.addBt,sp.contain,sp.p.back,sp.p2.back,set);
        this.#select();
        
        im=document.createElement("img");
                im.src="/MyImage/light2.png";
                im.style.position="absolute";
                im.style.display="none";
                im.style.width="100%";
                im.style.height="100%";

                this.#effect2=new G1Dto();
                this.#effect2.contain=im;
                this.#effect2.callback=(()=>{
                    var tar=im;
                    return ()=>{
                        gsap.timeline().set(tar,{display:"block",bottom:"150%",left:"-150%"})
                    .to(tar,{bottom:"0",left:"0%",duration:0.3,ease:"none"}).set(tar,{display:"none",onComplete:()=>this.#animing=false});
                    }
                })();
    }
    static #select(){
        this.#next=this.#seed[rand(0,this.#seed.length)];

        this.#nextIcon.src=this.item[this.#next];
        this.#nextIconN.textContent=this.#next+1;
    }
    //item 裡
    static add(){
        if(!this.#animing){
            var bt=[];
        for(let i=0;i<this.map.length;i++){
            if(this.map[i]==null){
                bt.push(i);
            }
        }
        if(bt.length!=0){
            Music.effectPlay("ex");
            this.#animing=true;
            var ind=bt[rand(0,bt.length)];
            this.#addset(ind,this.#next);
            this.#addScore(this.#next+1);
            this.block[ind].appendChild(this.#effect2.contain);
            this.#effect2.callback();
            this.#select();
        }
        if(bt.length==1)
            this.check();
        }
        
    }
    
    static #dir=[[0,1,2,3],[3,7,11,15],[12,13,14,15],[0,4,8,12]]
    static #dd=[4,-1,-4,1];
    static #merge=false;
    /**
     * @param {number} dir 0上 1右 2下 3左
     */
    static change(dir){
        var dx=this.#dd[dir];
        this.#merge=false;
        for (let i = 0; i < 3; i++) {
            this.#dir[dir].forEach(s=>{
                var indb=s+i*dx;
                var ind=indb+dx;
                if(this.map[ind]!=null&&this.map[indb]!=null&&this.map[ind]==this.map[indb]){
                    if(this.map[ind]+1<this.item.length){
                        this.#update[ind]=true;
                        this.#addScore(Math.pow((this.map[ind]+2),2));
                        this.set(indb,this.map[ind]+1,ind);
                        this.set(ind);
                        
                        this.#merge=true; 
                        if(this.map[indb]==this.#max){
                            
                            this.#seed.push(this.#max-3);
                            this.#max++;
                        }
                        
                    }
                }
            })   
        }
        for (let i = 0; i < 3; i++) {
            this.#dir[dir].forEach(s=>{
                var indb=s+i*dx;
                var ind=indb+dx;
                if(this.map[ind]!=null&&this.map[indb]==null){
                    this.set(indb,this.map[ind],ind);
                    this.set(ind);
                    this.#merge=true;
                }
            })   
        }
        if(this.#merge){
            this.change(dir);
        }
        else{
            for(let i=0;i<this.#update.length;i++){
               if(this.#update[i]){
                    this.#effect[i].callback();
                    this.#update[i]=false;
                } 
            }   
        }
    }
    /**
     * 
     * @param {*} tarInd 
     * @param {null|number} MapInd =null 時remove 
     */
    static set(tarInd,MapInd=null,BFInd=null){
        this.block[tarInd].replaceChildren();
        this.map[tarInd]=MapInd;
        if(MapInd!=null){
            var img=image(this.item[MapInd]);
            this.block[tarInd].appendChild(img);
            var lab=document.createElement("div");
            lab.textContent=MapInd+1;
            addHtmlChildren(this.block[tarInd],img,lab,this.#effect[tarInd].contain);
            if(BFInd!=null){
                this.#update[tarInd]=this.#update[BFInd];
                this.#update[BFInd]=false;
            }
        }
    }
    /**
     * @param {number} tarInd 
     * @param {number} MapInd 
     */
    static #addset(tarInd,MapInd){
        this.block[tarInd].replaceChildren();
        this.map[tarInd]=MapInd;
        
            var img=image(this.item[MapInd]);
            img.style.display="none";
            this.block[tarInd].appendChild(img);
            var lab=document.createElement("div");
            lab.textContent=MapInd+1;
            addHtmlChildren(this.block[tarInd],img,lab,this.#effect[tarInd].contain);
        gsap.fromTo(img,{display:"block",left:"-140%",bottom:"120%"},{left:"-20%",bottom:"0",ease:"none",duration:0.3});
    }
    static check(){
        var gameOver=true;
        var r=4;
        var c=4;
        var a=[];
        for(let i=0;i<r;i++){
            var as=[];
            for(let j=0;j<c;j++){
                as.push(this.map[i*c+j]);
            }
            a.push(as)
        }
        for(let i=0;i<r;i++){
            for(let j=0;j<c;j++){
                if(a[i][j]==this.item.length-1)
                continue;
                const n = [];

                if (i > 0) n.push(a[i - 1][j]);     // 上
                  if (i < 3) n.push(a[i + 1][j]);     // 下
                  if (j > 0) n.push(a[i][j - 1]);     // 左
                  if (j < 3) n.push(a[i][j + 1]);
               
                for(let v of n){
                    if(v==a[i][j]){
                        gameOver=false;  
                        break;
                    }  
                }
            }
        }
        if(gameOver){
            this.gameOverCallback();
        }
    }
    static #addScore(n){
        this.#score+=n;
        this.score.textContent=this.#score;
    }
    
}
class Music{
    /**@type {HTMLAudioElement} */
    static effectPlayer
    /**@type {HTMLAudioElement} */
    static effectPlayer2
    /**@type {HTMLAudioElement} */
    static musicPlayer
    /**@type {{}} */
    static map;
    static effectPlay2(name){
        Music.effectPlayer2.pause();
        Music.effectPlayer2.src=this.map[name];
        Music.effectPlayer2.play();
    }
    static effectPlay(name){
        Music.effectPlayer.pause();
        Music.effectPlayer.src=this.map[name];
        Music.effectPlayer.play();
    }
    static musicPlay(name){
        Music.musicPlayer.pause();
        Music.musicPlayer.src=this.map[name];
        Music.musicPlayer.play();
    }
    static init(){
        this.map={
            "ef-df":"/MyMusic/default.wav",
            "df":"/MyMusic/bgm.mp3",
            "ex":"/MyMusic/ex.mp3",
            "bgm":"/MyMusic/bgm.mp3",

            "hit":"/MyMusic/hit.mp3",
            "stop":"/MyMusic/stop.mp3",
            "bgmtree":"/MyMusic/treebgm.mp3",
            "eff":"/MyMusic/prop.mp3",
        }
        this.effectPlayer=document.createElement("audio");
        this.effectPlayer2=document.createElement("audio");
        this.musicPlayer=document.createElement("audio");
        Music.musicPlayer.loop=true;

    }
}
class Contain{
    /**
     * @param  {...HTMLElement} element 
     * @returns {HTMLDivElement} 
     */
    static divc(...element){
        var div=document.createElement("div");
        div.className="contain divc";
        element.forEach(e=>{
            div.appendChild(e);
        }); 
        return div;
    }
    static divr(...element){
        var div=document.createElement("div");
        div.className="contain divr";
        element.forEach(e=>{
            div.appendChild(e);
        }); 
        return div;
    }
}

class Page{
    constructor(){
        this.back.className="Page back";
        this.main.className="Page main";
        this.back.appendChild(this.main);
        this.main.onclick=(event)=>{
         event.stopPropagation();
        }
        this.back.onclick=()=>{
           this.back.style.display="none";
        }
        
        
    }
    
    /**@type {HTMLDivElement} 添加UI*/
    main=document.createElement("div");
    /**@type {HTMLDivElement} */
    back=document.createElement("div");
    //樣式選擇可擴充 不同頁面
    styleSetting(){
        /**@type {Array<HTMLInputElement>} */
        var inp=new Array();
        var e;
        var str=["主音量","音樂","音效"];
        for(let i=0;i<3;i++){

            e=document.createElement("h1");
            e.textContent=str[i];

            inp.push(document.createElement("input"));
            inp[i].type="range";
            inp[i].max="100";
            inp[i].min="0";
            inp[i].value=100;
            inp[i].style.width="100%";
            this.main.appendChild(Contain.divc(e,inp[i]));
            this.main.children[i].style.width="30%";
        }
        inp[0].oninput=()=>{
            inp[2].value=inp[1].value=inp[0].value;
            var v=inp[0].value/100;
            Music.musicPlayer.volume=v;
            Music.effectPlayer.volume=v;
        }
        inp[1].oninput=()=>{
            Music.musicPlayer.volume=inp[1].value/100;
            inp[0].value=(parseInt(inp[1].value)+parseInt(inp[2].value))/2;
        }
        inp[2].oninput=()=>{
            Music.effectPlayer.volume=inp[2].value/100;
            inp[0].value=(parseInt(inp[1].value)+parseInt(inp[2].value))/2;
            if(Music.effectPlayer.paused)
                Music.effectPlay("ef-df");
        }
        

        return inp;
    }
    styleInfo(str){
        this.main.innerHTML=str;
    }
}
class StartPage{
   constructor(title="小遊戲",startCallback=()=>{},info=""){
    this.p=new Page();
    this.p.styleSetting();
    this.contain.className="StartPage contain";
    this.startDiv.className="btnn";
    this.settingDiv.className="btnn";
    this.infoDiv.className="btnn";
    var e=document.createElement("h1");
    e.textContent=title;
    e.className="txtEdge";
    this.contain.style.backgroundColor="rgba(0,0,0,0.8)";
    this.contain.appendChild(e);
    this.startDiv.textContent="開始遊戲";
    this.startDiv.onclick=startCallback;
    this.contain.appendChild(this.startDiv);
    this.settingDiv.textContent="設定";
    this.contain.appendChild(this.settingDiv);
    this.settingDiv.onclick=()=>{
        this.p.back.style.display="flex";
    }
    this.contain.appendChild(this.infoDiv);
    this.infoDiv.textContent="說明";
    this.p2=new Page();
    this.p2.styleInfo(info);
    this.infoDiv.onclick=()=>{
        this.p2.back.style.display="flex";
    }
   }
   p2;
   p;
   /**@type {HTMLDivElement} */
   contain=document.createElement("div");;
   /**@type {HTMLDivElement} */
   startDiv=document.createElement("div");
   /**@type {HTMLDivElement} */
   settingDiv=document.createElement("div");
   /**@type {HTMLDivElement} */
   infoDiv=document.createElement("div");
}
class TimerUi{
    contain=document.createElement("div");
    start=new Date();
    now=new Date();
    end=new Date();
    /**@type {number} sec 變化量*/
    duration=-1;
     /**@type {number} milisec 更新率*/
    itvlRe=1000;
    /**@type {()=>} */
    endCallback;
    /**
     * @param {()=>} endCallback 
     */
    constructor(endCallback=()=>{}){
        this.end.setHours(0,0,0);
        this.start.setHours(0,0,0);
        this.contain.textContent="00:00";
        this.endCallback=endCallback;
    }

    play(){
        this.now=new Date(this.start);
        this.contain.textContent=
            this.#format(this.now.getMinutes())
            +":"+this.#format(this.now.getSeconds());
        if(this.duration>0){
            timer(()=>{
            this.now.setSeconds(this.now.getSeconds()+this.duration);
            this.contain.textContent=
            this.#format(this.now.getMinutes())
            +":"+this.#format(this.now.getSeconds());
            if(this.now<this.end){
                return true;
            }
            return false;
            },this.itvlRe)
        }
        else if(this.duration<0){
            timer(()=>{
            this.now.setSeconds(this.now.getSeconds()+this.duration);
            this.contain.textContent=
            this.#format(this.now.getMinutes())
            +":"+this.#format(this.now.getSeconds());
            if(this.now>this.end){
                return true;
            }
            this.endCallback();
            return false;
            },this.itvlRe)
        }
    }
    /**
     * @param {number} n 
     */
    #format(n,d=2){
        var str="0000000000"+n.toString();
        return str.substring(str.length-d);
    }
}
class TimerBar{
    contain=document.createElement("div");
    #bar=document.createElement("div");
    /**@type {number} %百分比 readOnly 請用setNow(pc)*/
    now=100;
    /**@type {number} %遞減百分比*/
    dp=4;
    /**@type {number} milisec 更新率*/
    itvlRe=33;
    isPlaying=false;
    /**@type {()=>} 0%*/
    firstCallback;
    /**@type {()=>} 100%*/
    endCallback;
    /**
     * 
     * @param {object} param0 
     * @param {()=>} param0.firstCallback 
     * @param {()=>} param0.endCallback
     */
    constructor({firstCallback=()=>{},endCallback=()=>{}}={}){
        this.firstCallback=firstCallback;
        this.endCallback=endCallback;
        this.contain.appendChild(this.#bar);
        this.contain.className="TimerBar contain"; 
        this.#bar.className="TimerBar bar";    
    }
    /**
     * @param {number} duration sec
     */
    setFromDuration(duration){
        this.dp=100/(duration/itvlRe*1000);
    }
    /**
     * @param {number} pc 百分比
     */
    setNow(pc=null){
        if(pc!=null)
            this.now=pc;
        if(this.now>=100)
            this.endCallback();
        gradient(this.#bar,"right",rgb(227, 189, 2,"0%"),rgb(227, 189, 2,this.now.toString()+"%"),rgb(160, 160, 160,this.now.toString()+"%"),rgb(160, 160, 160,"100%"))
    }
    play(){
        if(!this.isPlaying){
            this.contain.style.display="block";
            timer(()=>{
            if(this.now>0){
                this.now-=this.dp;
                this.setNow();
                this.isPlaying=true;
                if(this.now<0)
                    this.now=0;
                return true;
            }
            this.contain.style.display="none";
            this.firstCallback();
            this.isPlaying=false;
            return false;
            },this.itvlRe)
        }
        
    }
}
class TimerPie{
    contain=document.createElement("div");
    cover=document.createElement("div");
    icon=document.createElement("img");
    /**@type {()=>} */
    endCallback;
    constructor(){
        this.contain.className="TimerPie contain";
        this.cover.className="TimerPie cover";
        this.icon.className="TimerPie icon";
        this.icon.src= "/MyImage/shield2.png";
        addHtmlChildren(this.contain,this.icon,this.cover);

    }
    setDeg(deg){
    }
    /**
     * @param {number} p 0~100
     */
    setPercentage(p){
         console.log(p)
        var deg=(360/100*p).toString();
        gradient_conic(this.cover,rgba(0, 0, 0, 0.5,"0deg"),rgba(0, 0, 0, 0.5,deg+"deg"),rgba(0, 0, 0, 0,deg+"deg"),rgba(0, 0, 0, 0,"360deg"));
        if(p==360){
            this.endCallback();
        }
    }
}
class Game_tree{
    /**@type {HTMLDivElement} */
    static contain;
    /**@type {TimerUi} */
    static timer;

    /**@type {string} */
    static path;
    /**@type {string} */
    static branch;
    /**@type {string[]} */
    static icon;

    /**@type {TimerPie} */
    static #effIcon;
    /**@type {HTMLDivElement[]} */
    static #tree;
    /**@type {Array<(dir:number)=>void>} */
    static #cutCallback;
    /**@type {number} */
    static #total;
    /**@type {number} */
    static maxCombo;
    /**@type {number} */
    static #combo;
    /**@type {HTMLDivElement} */
    static #comboDiv;
    /**@type {TimerBar} */
    static #combobar;
    /**@type {number} */
    static #score;
    /**@type {HTMLDivElement} */
    static #scoreDiv;
    /**@type {boolean} */
    static #isDizzy;
    /**@type {HTMLImageElement} */
    static star;
    /**@type {HTMLDivElement} */
    static char;
    /**@type {HTMLImageElement} */
    static #charImg;

    static init(){
        Music.init();
        this.#isDizzy=false;
        this.maxCombo=0;
        this.#combo=0;
        this.#total=0;
        this.#score=0;
        this.#pas=3;
        this.#times=1;
        this.#effect=()=>{};
        this.#effectN=0;
        this.#effIcon=new TimerPie();
        this.#immunity=false;
        this.#dizzCallback=()=>{};
        this.#effectMap=[];
        this.#tree=[];
        this.#cutCallback=[];
        this.timer=new TimerUi(()=>{
            var p=new Page();
            this.#score=Math.floor(this.#score*(1+this.maxCombo/400));
            p.styleInfo(`結算:<br>總分:${this.#score}<br>連續Combo數:${Math.floor(this.maxCombo)}
                <br>砍下木頭:${Math.floor(this.#total)}個`);
            this.contain.appendChild(p.back);
            p.back.style.display="flex";
        });
        this.#combobar=new TimerBar({firstCallback:()=>{this.#combo=0;this.#effectN=0;}})
        this.#comboDiv=document.createElement("div");
        this.#comboDiv.className="Game_tree combo textEdge";
        this.#combobar.contain.appendChild(this.#comboDiv);
        
        this.path="/MyImage/trunk.png";
        this.branch="/MyImage/branch.png";
        this.icon=["/MyImage/fire15.png","/MyImage/fire20.png","/MyImage/fire25.png"
            ,"/MyImage/shield2.png","/MyImage/shield3.png"];
        
        this.#scoreDiv=document.createElement("div");
        this.#scoreDiv.className="Game_tree score textEdge";

        this.char=document.createElement("div");
        this.char.className="Game_tree charSpace";
        this.#charImg=document.createElement("img");
        this.#charImg.src="/MyImage/axes.png";
        this.#charImg.className="Game_tree char";
        var spac=document.createElement("div");
        spac.className="Game_tree starSpace";
        this.star=document.createElement("img");
        this.star.src="/MyImage/starc.png";
        this.star.className="Game_tree star";
        spac.appendChild(this.star);
        addHtmlChildren(this.char,this.#charImg,spac);
        
        this.contain=document.createElement("div");
        this.contain.className="Game_tree main contain";
        this.timer.contain.className="Game_tree timer textEdge";
        
        var str=`玩法說明:<br>在時間內砍下木材即可得分，如果碰到樹葉會被擊暈，請小心！<br>操作說明:<br>使用方向鍵或點選按鈕。<br>挑戰:<br>在時間內盡可能達到高分。<br>！Combo<br>！不要被擊暈<br>！多吃道具
         <br>道具說明:<br>分數&Combo X1.5倍(8次) 、 分數&Combo X2.0倍(8次) 、 分數&Combo X2.5倍(8次) 、 免除下次暈眩 、 無敵(8次)<br><div class="Game_tree desp"> `;
        var icon=document.createElement("img");
        this.icon.forEach(e=>{
            icon.src=e;
            str+=icon.outerHTML;
        })
        
        str+="</div>";
         var sp=new StartPage("海島伐木遊戲",()=>{
            Music.musicPlay("bgmtree");
            this.contain.removeChild(sp.contain);
            this.timer.play();
        },str);
        var set=document.createElement("img");
        set.src="/MyImage/setting.png";
        set.style.position="absolute";
        set.style.top="0";
        set.style.right="0";
        set.style.width="5%";
        set.style.height="5%";

        set.onclick=()=>sp.settingDiv.click();

        var btl=document.createElement("div");
        btl.textContent="←";
        btl.className="Game_tree dir l textEdge";
        btl.onclick=()=>{
            this.cut(-1)
        };
        var btr=document.createElement("div");
        btr.textContent="→";
        btr.className="Game_tree dir r textEdge";
        btr.onclick=()=>{
            this.cut(1)
        };

        this.#effIcon.contain.className=this.#effIcon.contain.className+" Game_tree effIcon";

        addHtmlChildren(this.contain,this.timer.contain,sp.contain,sp.p.back,sp.p2.back,set,btl,btr,this.char,this.#combobar.contain,this.#scoreDiv,this.#effIcon.contain);
        this.timer.start.setMinutes(1);
         Music.effectPlayer.muted=true;
        for(let i=0;i<8;i++){
            this.#cutCallback.push(()=>{});
            this.#effectMap.push(null);
            this.#tree.push(document.createElement("div"));
        }
        for(let i=0;i<8;i++){      
            this.#add(rand(1,3)==1?1:-1);
        } 
        setTimeout(()=>Music.effectPlayer.muted=false,500);
    }
    //道具
    static #times;
    /**@type {()=>} */
    static #effect;

    static #effectN;
    /**@type {boolean} */
    static #immunity;
    /**@type {(dir:number)=>} */
    static #dizzCallback;
    /**@type {Array<number | null>} */
    static #effectMap;
    //生成
    static #pas;
    static #lasDir;
    /**
     * @returns {boolean}
     */
    static #generate(){
        if(this.#pas>0){
            this.#pas--;
            return false;
        }
        var bt;
        if(this.#total<100){
            bt=4;
        }
        else if(this.#total<200){
            bt=5;
        }
        else if(this.#total<300){
            bt=7;
        }
        else{
            bt=8;
        }

        if(rand(1,11)<bt){
            this.#pas=1;
            return true;
        }
        return false;
    }
    /**
     * @param {number|null} dir -1 1 null 
     * @param {number|null} effect 
     */
    static #add(dir = null, effect = null) {
        var e = document.createElement("div");
        e.className = "Game_tree trunk contain";
        e.style.top = "-26%";
        var left = document.createElement("div");
        left.className = "Game_tree trunk l";
        var center = document.createElement("img");
        center.className = "Game_tree trunk c";
        center.src = this.path;
        var right = document.createElement("div");
        right.className = "Game_tree trunk r";
        this.#effectMap.pop();
        if (dir != null&&this.#total >= 300) {
                dir = -this.#lasDir;
        }
        if (effect != null) {
            if (dir == null) {
                effect = effect * (rand(1, 3) == 1 ? 1 : -1);
            }
            else
                effect = effect * -dir;
        }
        if (dir == null || !this.#generate()) {
            this.#cutCallback.unshift((dir) => this.#addScore(dir));
        }
        else {
            var tt = document.createElement("img");
            tt.src = this.branch;
            
            if (dir == 1) {
                tt.className = "Game_tree branchR";
                right.appendChild(tt);
                this.#cutCallback.unshift((dir) => {
                    if (dir == 1)
                        this.#dizzy(dir);
                    else
                        this.#addScore(dir);
                });
                this.#lasDir = 1;
            }
            else if (dir == -1) {
                tt.className = "Game_tree branchL";
                left.appendChild(tt);
                this.#cutCallback.unshift((dir) => {
                    if (dir == -1)
                        this.#dizzy(dir);
                    else
                        this.#addScore(dir);
                });
                this.#lasDir = -1;
            }
        }
        this.#effectMap.unshift(effect);
        Music.effectPlay("hit");
        if(effect!=null){
            var icon=document.createElement("img");
            icon.className="Game_tree icon";
            var dp=effect<0;
            effect=Math.abs(effect);
            icon.src=this.icon[effect-1];

            if(dp){
                
                left.appendChild(icon);  
            }
            else
                right.appendChild(icon);  
        }

        addHtmlChildren(e, left, center, right);
        this.#tree.unshift(e);
        this.contain.appendChild(e);
        this.#cutCallback.pop();
        this.#tree.forEach(e => e.style.top = (parseInt(e.style.top) + 13).toString() + "%")
        this.#tree.pop();
        
    }
    static #dizzy(dir){
        
        if (!this.#immunity) {
            this.#isDizzy = true;
            this.#combobar.setNow(0);
            Music.effectPlay("stop");
            gsap.fromTo(this.star, { rotationZ: 0, display: "block" }, {
                rotationZ: 300, display: "none",
                duration: 0.8,
                ease: "linear"
            });
            setTimeout(() => {
                this.#isDizzy = false;
            }, 800);
        } 
        else{
            this.#dizzCallback(dir);
        }
    }
    static cut(dir){
        if(!this.#isDizzy){
            this.#cutCallback.at(-1)(dir);
            if(dir==-1){
                gsap.timeline()
                .set(this.char,{left:"30%",bottom:"0",})
                .set(this.#charImg,{rotateY:180})
                .fromTo(this.char,{display:"block"},{display:"none",duration:0.2,ease:"none"});
            }
            else if(dir==1){
                gsap.timeline()
                .set(this.char,{left:"60%",bottom:"0",})
                .set(this.#charImg,{rotateY:0})
                .fromTo(this.char,{display:"block"},{display:"none",duration:0.2,ease:"none"});
            }
            this.#comboDiv.textContent="Combo "+Math.floor(this.#combo).toString();
            var str=Math.floor(this.#score).toString();
            var str2=str[0];
            str=str.split("").reverse();
            for (let i = 1; i < str.length; i++) {
                if(i%3==0)
                    str2+=",";
                str2+=str[i];
            }
            this.#scoreDiv.textContent=str2.split("").reverse().join("");
        }
            
    }
    
    static #addScore(dir){
        this.#effectN++;
        this.#total+=this.#times;
        this.#combo+=this.#times;
        
        this.#combobar.setNow(100);
        this.#combobar.play();
        if(this.#combo>this.maxCombo)
            this.maxCombo=this.#combo;
        this.#score+=rand(1500,2000)*this.#times;

        

        var tar=this.#tree.at(-1);
        var dy=rand(-50,0).toString();
        var dt=0.4;
        if(dir<0){
            gsap.timeline().to(tar,{top:dy+"%",left:"100%",rotateZ:"-50deg",ease:"none",duration:dt},0)
            .call(()=>this.contain.removeChild(tar),[],dt)
            ;
        }
        else if(dir>0){
            gsap.timeline().to(tar,{top:dy+"%",left:"-20%",rotateZ:"50deg",ease:"none",duration:dt},0)
            .call(()=>this.contain.removeChild(tar),[],dt)
            ;
        }
        this.#effect();
        var ef=this.#effectMap.at(-1);
        
        if(ef!=null&&dir*ef>0){
            ef=Math.abs(ef);
            this.#effIcon.icon.src=this.icon[ef-1];
            this.#effIcon.setPercentage(0);
            this.#effIcon.contain.style.display="flex";
            Music.effectPlay2("eff");
            if(ef==1){
                this.#times=1.5;
                this.#effect=(()=>{
                    var n=8;
                    return()=>{
                        if(n==0){
                            this.#effect=()=>{};
                            this.#times=1;
                            this.#effIcon.contain.style.display="none";
                        }
                        n--;
                        this.#effIcon.setPercentage(100/8*(8-n));
                    };
                })();
            }
            else if(ef==2){
                this.#times=2;
                this.#effect=(()=>{
                    var n=8;
                    return()=>{
                        if(n==1){
                            this.#effect=()=>{};
                            this.#times=1;
                            this.#effIcon.contain.style.display="none";
                        }
                        n--;
                        this.#effIcon.setPercentage(100/8*(8-n));
                    };
                })();
            }
            else if(ef==3){
                this.#times=2.5;
                this.#effect=(()=>{
                    var n=8;
                    return()=>{
                        if(n==1){
                            this.#effect=()=>{};
                            this.#times=1;
                            this.#effIcon.contain.style.display="none";
                        }
                        n--;
                        this.#effIcon.setPercentage(100/8*(8-n));
                    };
                })();
            }
            else if(ef==4){
                this.#immunity=true;
                this.#dizzCallback=()=>{
                    this.#immunity=false;
                    this.#dizzCallback=()=>{};
                    this.#effIcon.contain.style.display="none";
                };
            }
            else if(ef==5){
                this.#immunity=true;
                this.#effect=(()=>{
                    var n=8;
                    return()=>{
                        if(n==1){
                            this.#effect=()=>{};
                            this.#immunity=false;
                            this.#dizzCallback=()=>{};
                            this.#effIcon.contain.style.display="none";
                        }
                        n--;
                        this.#effIcon.setPercentage(100/8*(8-n));  
                    };
                })();
                this.#dizzCallback=(dir)=>{
                    this.#addScore(dir);
                };
            }
        }
        if(this.#effectN==12){
            this.#effectN=0;
            this.#add(rand(1,3)==1?1:-1,rand(1,this.icon.length+1));
        }
        else
            this.#add(rand(1,3)==1?1:-1);
    }
}

/**
 * @param {string} src 
 * @returns {HTMLImageElement}
 */
function image(src){
    var e=document.createElement("img");
    e.src=src;
  
    e.style.width="100%";
    return e;
}
/**
 * @param {number} start 
 * @param {number} end 
 * @returns {number}start<=return<end
 */
function rand(start,end){
    return Math.floor(Math.random()*(end-start)+start);
}
/**
 * @param {()=>boolean} fun
 * @param {number} itvl 
 */
function timer(fun,itvl){
    setTimeout(() => {
        if(fun()){
            timer(fun,itvl);
        }
    }, itvl);
}
