// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
onload=()=>{
    var child=document.getElementsByClassName("alinks");
    var dp=new DropList();
    dp.addAnchorOptions(child,["使用者","商品"],"管理");
    
}
new MoveBackground("/MyImage/bg.jpg");
