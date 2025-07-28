var a=[];
var inp=document.createElement("input");

n=Math.ceil(n/parseInt(Cookie.get("Records")));
inp.value=Cookie.get("Records");
a.push(inp);
inp.placeholder="每頁顯示筆數";
inp.onchange=()=>{
    Cookie.setDays("Records",inp.value,30);
    window.location.href="/Shop/Shop/1";
}

product.forEach(e=>{
    var item=new ItemBlock(e.path,e.name,e.price,{clickCallback:()=>{
        window.location.href="/Shop/Product/"+e.Id;
    },cartCallback:()=>{
        fetch("/Shop/CartAdd",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({"ProductId":e.Id,"Delta":1})
        })
        .then(res=>{
            return res.json();
        })
        .then(res=>{
            
            RightCart.turn(1);
            RightCart.addItem(res);
        })
    }});
    a.push(item.contain);
});
var bt=new PageButton(DisplayPage,n,page,true,(n)=>{
        window.location.href="/Shop/Shop/"+n.toString();
    })
a.push(bt.contain);

Data.read("/Shop/CartAll",Data.cart,(e)=>e.productId,()=>{
    RightCart.init();
});

addEventListener("load",()=>{
    

 addHtmlChildArray(document.getElementsByClassName("main")[0],a);
});