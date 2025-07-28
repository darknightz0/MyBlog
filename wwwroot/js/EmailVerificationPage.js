var c=document.getElementsByClassName("main")[0];
/**@type {HTMLFormElement} */
var f=document.getElementById("fm");
/**@type {HTMLInputElement} */
var code=document.getElementById("code");
var e=new ECode(6,(str)=>{
    code.value=str;
    f.submit();
});
c.className="flexColume item center";

    c.appendChild(e.contain);

