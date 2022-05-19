function valida() {
    
    if (document.getElementById("rmb").checked) {
        alert("Hai scelto di essere ricordato come uno stronzo");
    }
    else {
        alert("Hai scelto di essere scaricato");
    }
}




function checkAuth() {
    console.log("L'unica cosa utile da fare qui, è settare i cookie...")
}



function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value.value || "")  + expires + "; path=/";
}