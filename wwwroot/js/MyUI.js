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
            if(this.#list.style.display=="none")
                gsap.fromTo(this.#list,{display:"block",top:"125%",opacity:0},{top:"100%",opacity:1,duration:0.4});
        };
        this.contain.onmouseleave=()=>{
            if(!this.#playing){
                this.#playing=true;
                gsap.fromTo(this.#list,{top:"100%",opacity:1},
                    {top:"125%",display:"none",opacity:0,duration:0.25,onComplete:()=>this.#playing=false});
            }        
        };
        this.title.onclick=()=>{
            if(this.#list.style.display=="none")
                gsap.fromTo(this.#list,{display:"block",top:"125%",opacity:0},{top:"100%",opacity:1,duration:0.4});
            else if(!this.#playing){
                this.#playing=true;
                gsap.fromTo(this.#list,{top:"100%",opacity:1},
                    {top:"125%",display:"none",opacity:0,duration:0.25,onComplete:()=>this.#playing=false});
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
        console.log(a[0].parentElement);
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
