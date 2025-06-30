/**@type {HTMLFormElement} */
var fm=document.getElementById("fm");
/**@type {HTMLButtonElement} */
var sub=document.getElementById("sub");
/**@type {HTMLDivElement} */
var c=document.getElementById("FeatureContain");
c.style.maxWidth="80%";
/**@type {HTMLInputElement} */
var inp=document.getElementById("FeatureInput");
/**@type {HTMLTextAreaElement} */
var txt=document.createElement("textarea");
txt.placeholder="最多五項";
txt.style.resize="both";
/**@type {HTMLInputElement} */
var bt=document.createElement("input");
var list={data:new Object()};
bt.type="button";
bt.value="新增特色說明";
function deleteMemory(id){
    return ()=>{
        delete list.data[id];
    }
}
bt.onclick=()=>{
    
    if(c.children.length<7){
        var lm=new ListMessage(txt.value);
        var id=Date.now().toString();
        list.data[id]=txt.value;
        lm.deleteCallback=deleteMemory(id);
        txt.value="";
        c.appendChild(lm.contain);
    } 
}
addHtmlChildren(c,txt,bt);

sub.onclick=()=>{
    list.data=Object.values(data.data);
    inp.value=JSON.stringify(data);
    fm.submit();
}




