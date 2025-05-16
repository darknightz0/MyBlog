var sb =new ShineBox();
addClassName(sb.contain,"MyNameContain");
var div =document.createElement("div");
addClassName(div,"textEdge","MyName");
div.textContent="歐陽德軒";
addHtmlChildren(sb.main,div);
sb.play();


addEventListener("load",()=>{
addHtmlChildren(document.body,sb.contain);
})
    