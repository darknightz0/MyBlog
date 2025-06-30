var c =document.getElementById("main");
var img=document.createElement("img");
img.src=user.data[0];
user.data[0]=img;
img.className="UserIcon icon";
var p= new InfoDiv("基本資訊","",title,user.data,link);
c.appendChild(p.contain);