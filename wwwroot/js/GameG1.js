var c=document.getElementsByClassName("main")[0];
Game_2048_1.init();
c.appendChild(Game_2048_1.contain);
addEventListener("keydown",(e)=>{
    
    if(e.code=="ArrowDown"){
        Game_2048_1.change(2);
        
    }
    else if(e.code=="ArrowUp"){
        Game_2048_1.change(0);
        
    }
    else if(e.code=="ArrowRight"){
        Game_2048_1.change(1);
        
    }
    else if(e.code=="ArrowLeft"){
        Game_2048_1.change(3);
    }
    else if(e.code=="Space"){
    
        Game_2048_1.add();
    }
    e.preventDefault();
})
document.body.style.overflowX="none";