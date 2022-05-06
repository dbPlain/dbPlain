function check(){
    var x = getCookie('email');
    console.log(x);
    if (x){
        document.getElementById("bho1").style.display="none";
        document.getElementById("bho2").style.display="none";
        document.getElementById("bho3").style.display="run-in";
    } else {
        document.getElementById("bho1").style.display="run-in";
        document.getElementById("bho2").style.display="run-in";
        document.getElementById("bho3").style.display="none";
    }
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
