/**@type {MessageBox} */
var mess=document.createElement("div-message");
var item=new Array();
BounceMessage.init();
var  p;
var st=new StartPage();
onload=()=>{
    p=st.p;
    var e=document.createElement("img");
    e.src=path["image-設定"];
    e.title="設定";
        e.onclick=()=>{
            Music.effectPlay();
            p.back.style.display="flex";
        }
        e.style.height="100%"
    e=Contain.divc(e);
    e.className="setting";
    document.body.appendChild(e);
    st.startDiv.onclick=()=>{
        Music.effectPlay();
        Music.musicPlay("music-序章");
        document.body.removeChild(st.contain);
    }
   document.body.appendChild(mess);
ClassAPI.mess=mess;

ClassAPI.set();
}
//"序章","開場"
ClassAPI.init(data,"序章","開場");