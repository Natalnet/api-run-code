/*while(true){
    console.log("é nois!\n");
}*/

var t = 0;
var a = "";
while(t <= 3000){
    if (t == 1000){
        console.log(a + "1");
        a = "";
    }
    else if(t == 200)
        console.log(a + "2");
    else
        a = a + "a";
}
