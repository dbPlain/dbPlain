function valida() {
<<<<<<< HEAD:nginx/login.js
    
    if (document.getElementById("rmb").checked) {
        alert("Hai scelto di essere ricordato come uno stronzo");
    }
    else {
        alert("Hai scelto di essere scaricato");
    }
}

=======
	if (document.getElementById('rmb').checked) {
		alert('Hai scelto di essere ricordato come uno stronzo');
	} else {
		alert('Hai scelto di essere scaricato');
	}
}

/*function setCookie(name, value, options = {}) {
>>>>>>> dac1b7b151489eba12ed4a7a1143d2b8209596c3:nginx/login/index.js


<<<<<<< HEAD:nginx/login.js

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
=======
// inserire httponly e :
// " will be soon rejected because it has the “SameSite” attribute set to “None” or an invalid value, without the “secure” attribute.
// To know more about the “SameSite“ attribute, read https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite "
function setCookie(name, value, days) {
	var expires = '';
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	document.cookie = name + '=' + (value.value || '') + expires + '; path=/';
}
>>>>>>> dac1b7b151489eba12ed4a7a1143d2b8209596c3:nginx/login/index.js
