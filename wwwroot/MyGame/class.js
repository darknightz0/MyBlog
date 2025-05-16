//extends HTMLElement 棄用
class MessageBox extends HTMLElement{
    
    constructor() {
        super();
        this.speed=50;
        this.#paragraph=0;
        this.#ind=0;
        this.#str="";
        this.#icon=document.createElement("img");
        this.#icon.src=path["icon_arrow"];
        this.context=document.createElement("p");
        this.contextTitle=document.createElement("p");
        this.contextTitleDiv=document.createElement("div");
        this.contextTitleDiv.className="divtit";
        this.contextDiv=document.createElement("div");
        this.contextDiv.className="divcon";
        this.onclick=()=>{
            if(this.#bt){
                if(this.#ind==0)
                    this.play();
                 else
                    this.paragraphEnd();
            }
            else{
                this.#stagefun();
                this.#bt=true;
            }
            
        }
    }
    connectedCallback(){
        this.contextTitleDiv.appendChild(this.contextTitle);
        this.appendChild(this.contextTitleDiv);
        this.contextDiv.appendChild(this.context);
        this.appendChild(this.contextDiv);
        this.contextDiv.appendChild(this.#icon);
    }
    /**
     * 初始化文檔 輸入劇情
     * @param {string[]} context 
     * @param {Object} [param2={}] 
     * @param {() => void} [param2.stagefun=()=>{}] stage end 觸發
     * @param {boolean} [param2.auto=true] 自動觸發 stagefun
     * @param {string[]} [param2.title=[""]] 
     * 
     */
    init(context,{stagefun=()=>{},auto=true,title=[]}={}){
        this.#title=title;
        this.#auto=auto;
        this.#stagefun=stagefun;
        this.#context=context;
    }
    /**@type {string} 段落*/
    stage=null;
    /**@type {number} 每個字元/msec */
    speed;
    /**@type {HTMLParagraphElement} 內文*/
    context;
    /**@type {HTMLDivElement} 內文區塊*/
    contextDiv;
    /**@type {HTMLParagraphElement} 段落標題*/
    contextTitle;
    /**@type {HTMLDivElement} 段落標題區塊*/
    contextTitleDiv;
    /**@type {number} 目前段落*/
    #paragraph;
    /**@type {number} 目前字元*/
    #ind;
   
    /**@type {Object} #id.value*/
    #id;
    /**@type {HTMLImageElement} 段落完結圖示*/
    #icon;
    /**@type {string} */
    #str;
    /**@type {boolean} */
    #bt=true;
    /**@type {string[]} */
    #title;
    /**@type {boolean} */
    #auto;
    /**@type {() => void} */
    #stagefun;
    /**@type {string[]} */
    #context;
    
    paragraphEnd(){
        this.#ind=this.#context[this.#paragraph].length;
    }
    pause(){
        clearTimeout(this.#id.value);
    }
    close(){
        this.style.display="none";
    }
    play(){
        this.style.display="inline";
        this.#icon.style.display="none";
        this.#str=this.#context[this.#paragraph];
        this.#id=timer(()=>{
            this.contextTitle.textContent=this.#title[this.#paragraph];
            if(this.#ind<=this.#str.length){
                this.context.textContent=this.#str.substring(0,this.#ind).padEnd(this.#str.length);
                this.#ind++;
                return true;
            }
            this.#icon.style.display="flex";
            this.#ind=0;
            this.#paragraph++;
            if(this.#paragraph==this.#context.length){
                this.#paragraph=0;
                this.#bt=this.#auto;
                if(this.#bt){
                    this.#stagefun();
                }
                   
            }    
            return false;
        },this.speed);
    }
    /**物件資料查看 ?!*/
    stageChange(nextStage){
        this.paragraphEnd();
        this.play();
    }
}
customElements.define('div-message', MessageBox);

/**
 * @param {()=>boolean} fun
 * @param {number} itvl 
 * @returns {Object}  id.value
 */
function timer(fun,itvl){
    var id=new Object();
    tt(fun,itvl);
    return id;
    function tt(fun,itvl){
        id.value=setTimeout(() => {
            if(fun()){
                tt(fun,itvl);
            }
        }, itvl);
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
        addEventListener("load",()=>{
            document.body.appendChild(this.back);
        })
        
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
                Music.effectPlay();
        }
        var div;
        var a=new Array();
        for(let i=0.5;i<2.5;i+=0.25)
            a.push(i.toFixed(2));
        var list=new LRList(a);
        list.changeCallback=(str)=>{
            NextPage.duration=parseFloat(str);
        };
        NextPage.duration=parseFloat(a[0]);
        var valid=document.createElement("input");
        valid.type="button";
        valid.value="展示";
        valid.onclick=()=>{Music.effectPlay();NextPage.fun=()=>{};NextPage.play();};
        e=document.createElement("h1");
        e.textContent="轉場";
        div=Contain.divr(list.body,valid);
        div.style.width="100%";
        div=Contain.divc(e,div);
        div.style.width="30%";
        this.main.appendChild(div);

        return inp;
    }
     /**
      * @param  {string} title 
     * @param  {string[]} opt 
     * @returns {Array<HTMLElement>} 
     */
    styleOption(title,opt){
        this.main.replaceChildren();
        this.main.className="Page main Option";
        /**@type {Array<HTMLInputElement>} */
        var op=new Array();
        var h1=document.createElement("h1");
        h1.textContent=title;
        this.main.appendChild(h1);
        opt.forEach(e=>{
            var div=document.createElement("div");
            div.textContent=e;
            op.push(div);
            this.main.appendChild(div);
        }); 
        return op;
    }
    
}

class StartPage{
   constructor(){
    this.p=new Page();
    this.p.styleSetting();
    this.contain.className="StartPage contain";
    this.startDiv.className="btn";
    this.settingDiv.className="btn";
    var e=document.createElement("h1");
    e.textContent="劇情選擇遊戲-異世界勇者 失落森林&聖靈之羽";
    e.className="txtEdge";
    this.contain.style.backgroundImage=url("image-封面");
    this.contain.appendChild(e);
    this.startDiv.textContent="開始遊戲";
    this.contain.appendChild(this.startDiv);
    this.settingDiv.textContent="設定";
    this.contain.appendChild(this.settingDiv);
    this.settingDiv.onclick=()=>{
        Music.effectPlay();
        this.p.back.style.display="flex";
    }
    addEventListener("load",()=>{
        document.body.appendChild(this.contain);
    })
   }
   p;
   /**@type {HTMLDivElement} */
   contain=document.createElement("div");;
   /**@type {HTMLDivElement} */
   startDiv=document.createElement("div");
   /**@type {HTMLDivElement} */
   settingDiv=document.createElement("div");
}

class Music{
    /**@type {HTMLAudioElement} */
    static effectPlayer=document.createElement("audio");
    /**@type {HTMLAudioElement} */
    static musicPlayer=document.createElement("audio");
    static effectPlay(name="effect-default"){
        Music.effectPlayer.pause();
        Music.effectPlayer.src=path[name];
        Music.effectPlayer.play();
    }
    static musicPlay(name){
        Music.musicPlayer.pause();
        Music.musicPlayer.src=path[name];
        Music.musicPlayer.play();
    }
}
Music.musicPlayer.loop=true;

function adjust(e){
    Music.music.volume=e.value/100;
}
//data解析
class ClassAPI{
    /**@type {Object} */
    static data;
    /**@type {string} */
    static stage;
    /**@type {string} */
    static section;
    /**@type {MessageBox} */
    static mess;
    /**@type {Page} */
    static p=new Page();
    /**@type {HTMLElement[]} */
    static op;
    static set(){
        switch (ClassAPI.#now.type) {
            case "對話":
                ClassAPI.#typy1();
                break;
            case "對話生成":
                ClassAPI.#typy6();
                break;
            case "對話觸發":
                ClassAPI.#typy9();
                break;
            case "對話選擇":
                ClassAPI.#typy2();
                break;
            case "對話選擇生成":
                ClassAPI.#typy5();
                break;      
            case "選擇結果":
                ClassAPI.#typy3();
                break;
            case "空":
                ClassAPI.#typy4();
                break;
            case "空2":
                ClassAPI.#typy7();
                break;
            case "end":
                ClassAPI.#typy8();
                break;        
            default:
                console.log(ClassAPI.#now.type);
                console.log("unknown type");
                break;
        }
    }
    static #str1;
    static #str2;
    /**@type {Object} */
    static #now;
    static init(data,stage,section){
        ClassAPI.data=data;
        ClassAPI.stage=stage;
        ClassAPI.section=section;
        ClassAPI.#now=ClassAPI.data[ClassAPI.stage][ClassAPI.section];
    }
    /** @param {boolean} bt is array or fun*/
    static #next(ind=0,bt=1){
        if(!Array.isArray(ClassAPI.#now.next)&&bt){
            console.log(ClassAPI.#now.next);
            console.log("必須是[]");
        }
        ClassEvent.event(ClassAPI.#now);
        ClassAPI.#str1=ClassAPI.#now.nextStage;
        if(bt)
            ClassAPI.#str2=ClassAPI.#now.next[ind];
        else
            ClassAPI.#str2=ClassAPI.#now.next()[ind];
        if(ClassAPI.#str1)
            ClassAPI.stage=ClassAPI.#str1;
        if(ClassAPI.#str2)
            ClassAPI.section=ClassAPI.#str2;
        ClassAPI.#now=ClassAPI.data[ClassAPI.stage][ClassAPI.section];  
    }
    static #typy1(){
        ClassAPI.mess.init(ClassAPI.#now.描述,{auto:true,title:ClassAPI.#now.標題,stagefun:()=>{
            ClassAPI.#next();
            ClassAPI.set();
        }});
    }
    static #typy6(){
        ClassAPI.mess.init(ClassAPI.#now.描述,{auto:true,title:ClassAPI.#now.標題,stagefun:()=>{
            ClassAPI.#next(0,0);
            ClassAPI.set();
        }});
    }
    static #typy9(){
        ClassAPI.mess.init(ClassAPI.#now.描述,{auto:false,title:ClassAPI.#now.標題,stagefun:()=>{
            ClassAPI.#next();
            ClassAPI.set();
        }});
    }
    static #typy2(){
        ClassAPI.mess.init(ClassAPI.#now.描述,{auto:false,title:ClassAPI.#now.標題,stagefun:()=>{
            ClassAPI.p.back.style.display="flex";
        }});
        ClassAPI.#next();
        ClassAPI.op=ClassAPI.p.styleOption(ClassAPI.#now.標題,ClassAPI.#now.選項);
        for(let i=0;i<ClassAPI.#now.選項.length;i++){
            ClassAPI.op[i].onclick=()=>{
                ClassAPI.p.back.style.display="none";
                ClassAPI.#next(i);
                ClassAPI.set();
            }
        }
    }
    static #typy5(){
        ClassAPI.mess.init(ClassAPI.#now.描述,{auto:false,title:ClassAPI.#now.標題,stagefun:()=>{
            ClassAPI.p.back.style.display="flex";
        }});
        ClassAPI.#next();
        var txt=ClassAPI.#now.選項();
        ClassAPI.op=ClassAPI.p.styleOption(ClassAPI.#now.標題,txt);
        for(let i=0;i<txt.length;i++){
            ClassAPI.op[i].onclick=()=>{
                ClassAPI.p.back.style.display="none";
                ClassAPI.#next(i,0);
                ClassAPI.set();
                if(ClassAPI.#now.auto)
                    ClassAPI.mess.play();
            }
        }
    }
    static #typy3(){
        ClassAPI.mess.init(ClassAPI.#now.描述,{auto:true,title:ClassAPI.#now.標題,stagefun:()=>{
            ClassAPI.#next();
            ClassAPI.set();
        }});
        if(!ClassAPI.#now.auto)
            ClassAPI.mess.play();
    }
    static #typy4(){
        ClassAPI.mess.init([""],{auto:true,stagefun:()=>{
            ClassAPI.#next();
            ClassAPI.set();
            ClassAPI.mess.play();
        }});
        if(ClassAPI.#now.auto)
            ClassAPI.mess.play();
    }
    static #typy7(){
        ClassAPI.mess.init([""],{auto:true,stagefun:()=>{
            ClassAPI.#next();
            ClassAPI.set();
        }});
        if(ClassAPI.#now.auto)
            ClassAPI.mess.play();
    }
    static #typy8(){
        ClassAPI.mess.init([""],{auto:true});
        ClassAPI.mess.play();
        ClassEvent.event(ClassAPI.#now);
    }
}
class ClassEvent{
    /**
     * @param {Object} obj 
     */
    static event(obj){
        if(obj.music){
            Music.musicPlay(obj.music);
        }
        if(obj.bg){
            NextPage.play(()=>{
                document.body.style.backgroundImage=url(obj.bg);
            })
        }
        if(obj.item){
            BounceMessage.play("獲得道具:"+obj.item.str,path[obj.item.icon]);
            item.push(obj.item.str);
            console.log(item);
        }
        if(obj.lambda){
            obj.lambda();
        }
    }
}
class LRList{
    /**@type {HTMLDivElement} */
    body;
    /**@type {(str:string)=>} */
    changeCallback;
    /**@type {string[]} */
    list;
    /**@type {HTMLImageElement} */
    imgl;
    /**@type {HTMLImageElement} */
    imgr;
    #ind=0;
    /**@type {HTMLDivElement} */
    #txt;
    /**
     * @param {string[]} list 
     * @param {(str:string)=>} changeCallback 
     */
    constructor(list=[""],changeCallback=()=>{}){
        this.changeCallback=changeCallback;
        this.list=list;
        this.body=document.createElement("div");
        this.body.className="LRList contain";
        this.imgl=document.createElement("img");
        this.imgl.onclick=this.#change.bind(this);
        this.imgl.dir=-1;
        this.imgl.className="LRList imgl";
        this.body.appendChild(this.imgl);

        this.#txt=document.createElement("div");
        this.#txt.className="LRList txt";
        this.body.appendChild(this.#txt);

        this.imgr=document.createElement("img");
        this.imgr.onclick=this.#change.bind(this);
        this.imgr.dir=1;
        this.imgr.className="LRList imgr";
        this.body.appendChild(this.imgr);
        this.#txt.textContent=this.list[this.#ind];
        this.imgr.src=path["icon-箭頭右"];
        this.imgl.src=path["icon-箭頭左"];
    }
    /**
     * @param {Event} e 
     */
    #change(e){
        /**@type {HTMLElement} */
      var tar=e.target;
      
        this.#ind+=parseInt(tar.getAttribute("dir"));
        if(this.#ind<0)
            this.#ind=this.list.length-1;
        if(this.#ind>=this.list.length)
            this.#ind=0;
        this.#txt.textContent=this.list[this.#ind];
        this.changeCallback(this.list[this.#ind]);
    }
}

class NextPage{
    static init(){
        this.back.className="nextPage contain";
        document.body.appendChild(this.back);
    }
    static back=document.createElement("div");
    /**
     * 
     * @param {()=>} fun 
     * @param {number} type int 
     */
    static play(fun=()=>{},type){
        this.fun=fun;
        this.#changeType(type);
       switch (this.type) {
        case 0:
            this.#type0();
            break;
        case 1:
            this.#type1();
            break;
        default:
            break;
       }
    }
    /**@type {number} int */
    static type=0;
    /**@type {number} second */
    static duration=1;
    /**@type {()=>} */
    static fun=()=>{};
    static #changeType(type){
        if(type&&this.type!=type){
            this.type=type;
            this.back.replaceChildren();
            /**@type {HTMLDivElement} */
            var div;
            switch (this.type) {
                case 1:
                    let n=5;
                    for(let i=0;i<n;i++){
                        div =document.createElement("div");
                        div.style.height=100/n+"%";
                        div.style.width="100%";
                        div.className="nextPage main";
                        this.back.appendChild(div);
                    }
                    break;
                case 2:
                    let r=10,c=5;
                    
                    break;
                default:
                    break;
               }
        }
    }

    static #type0(){
         gsap.timeline().fromTo(".nextPage.contain",{display:"block",backgroundColor:"rgba(0,0,0,0)" },
            {backgroundColor:"rgba(0,0,0,1)",duration:this.duration*0.5,onComplete:this.fun})
            .to(".nextPage.contain",{display:"none",backgroundColor:"rgba(0,0,0,0)",duration:this.duration*0.5 },"+=0.25");
    }
    static #type1(){
        gsap.timeline().set(".nextPage.contain",{display:"flex",alpha:1,backgroundColor:"rgba(0,0,0,0)"})
        .fromTo(".nextPage.main ",{x:"100%"}, {x:0,duration:this.duration,stagger:0.2,onComplete:this.fun})
        .to(".nextPage.main",{x:"-100%",stagger:0.2,duration:this.duration*0.5 },"+=0.1")
        .set(".nextPage.contain",{display:"none"})
        ;
   }
}
addEventListener("load",()=>{
    NextPage.init();
})
class BounceMessage{
    static init(){
        this.div.className="bounceMessage contain";
        this.#title.className="bounceMessage title";
        this.#icon.className="bounceMessage icon";
        this.div.appendChild(this.#title);
        this.div.appendChild(this.#icon);
        window.addEventListener("load",()=>{
            document.body.appendChild(this.div);
        });
    }
    static div=document.createElement("div");
    static #title=document.createElement("p");
    static #icon=document.createElement("img");
    /**
     * @param {string} mess 
     * @param {string} iconPath 
     */
    static play(mess,iconPath){
        this.#title.textContent=mess;
        this.#icon.src=iconPath;
        Music.effectPlay();
        gsap.fromTo(".bounceMessage.contain",{display:"flex",top:"30%" },
            {display:"none",top:"5%",duration:1 });
    }
}

class EndingCredits{
    static init(){
        this.contain=createElement("div","EndingCredits contain");
        document.body.appendChild(this.contain);
    }
    /**@type {()=>} */
    static onComplete=()=>{};
    static speed=10;
    static #now;
    static #ind=0;
    static #data=[
        {"type":0,"title":"異世界勇者-失落森林&聖靈之羽","description":[],second:0},
        {"type":0,"title":"劇情設計","description":["ChatGPT"],second:3},
        {"type":0,"title":"BGM製作","description":["Suno AI"],second:3},
        {"type":0,"title":"效果音製作","description":["mixkit"],second:3},
        {"type":0,"title":"圖片製作","description":["Microsoft Copilot","Microsoft Designer"],second:3},
        {"type":0,"title":"程式開發","description":["歐陽德軒"],second:3},
        {"type":0,"title":"UI設計","description":["歐陽德軒"],second:3},
        {"type":0,"title":"技術支援","description":["HTML","CSS","JavaScript","GSAP"],second:3},
        {"type":1,"title":"感謝遊玩~~~",second:this.speed,duration:4},
    ];
    /**@type {HTMLDivElement} */
    static contain;
    static play(){
        this.#ind=0;
        gsap.fromTo(
        ".EndingCredits.contain",
            {backgroundColor:rgba(0,0,0,0),display:"flex"},
            {backgroundColor:rgba(0,0,0,1),duration:1,onComplete:this.add.bind(this)});
    }
    static add(){
        this.#now=this.#data[this.#ind];
        setTimeout(() => {
        switch (this.#now.type) {
            case 0:
                this.#type0();
                break;
            case 1:
                this.#type1();
                break;    
            default:
                console.log(this.#ind);
                console.log("unknown EndingCredits type");
                break;
        }
        this.#ind++;
        if(this.#ind<this.#data.length)
            this.add();
        else{
            this.onComplete();
            setTimeout(() => {
            gsap.to(
            ".EndingCredits.contain",
                {backgroundColor:rgba(0,0,0,0),display:"none",duration:1});

            },(((this.#now.duration)?this.#now.duration:0)+this.speed) * 1000)
        }
    }, ((this.#now.second)?this.#now.second:1) * 1000);
    }
    static #type0(){
        var con,h,div;
        con=createElement("div","EndingCredits type0 contain");
        h=createElement("h1");
        h.textContent=this.#now.title;
        con.appendChild(h);
        this.#now.description.forEach(e => {
            div=createElement("div","EndingCredits type0 txt txtEdge");
            div.style.backgroundColor=rgb(163, 1, 1)
            div.textContent=e;
            con.appendChild(div);
        });
        this.contain.appendChild(con);
        gsap.fromTo(con,
            {top:"100%"},
            {top:"-100%",
                duration:this.speed*2,ease:"none",
            onComplete:()=>{
                this.contain.removeChild(con);
        }});
    }
    static #type1(){
        
        var con,h;
        con=createElement("div","EndingCredits type1 contain");
        h=createElement("h1");
        h.textContent=this.#now.title;
        con.appendChild(h);
        
        this.contain.appendChild(con);
        gsap.timeline()
        .fromTo(con,
            {opacity:0,display:"flex"},
            {opacity:1,duration:this.#now.duration/2,ease:"none",    
        })
        .to(con,
            {opacity:0,display:"flex",duration:this.#now.duration/2,ease:"none"
                , onComplete:()=>{
                    this.contain.removeChild(con);
            }
            },"+="+this.speed
        );
           
    }
}
addEventListener("load",()=>{
    EndingCredits.init();
});
function tt(){
    EndingCredits.play();
}