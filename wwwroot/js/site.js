// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
onload=()=>{
    var child=document.getElementsByClassName("alinks");
    if(child.length!=0){
        var dp=new DropList();
        dp.addAnchorOptions(child,["使用者","商品","日誌"],"管理");
    }
    var bt=document.getElementById("logoutbt");
    if(bt!=null){
        bt.style.display="none";
        var ic=new UserIcon(data)
        bt.parentNode.appendChild(ic.contain);
        ic.logOut.onclick=()=>bt.click();
        ic.bt.onclick=()=>window.location.href="/User/Info";
    }
    child=document.getElementsByClassName("glinks");
    if(child.length!=0){
        var dp=new DropList();
        dp.addAnchorOptions(child,["2048合合合","海島伐木"],"小遊戲");
    }
}
new MoveBackground("/MyImage/bg.jpg");
