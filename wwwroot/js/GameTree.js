Game_tree.init();
document.body.appendChild(Game_tree.contain);

addEventListener("keydown",(e)=>{
    if(e.code=="ArrowRight"){
        Game_tree.cut(1);
    }
    else if(e.code=="ArrowLeft"){
        Game_tree.cut(-1);
    }
})