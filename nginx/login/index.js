function valida() {
	if (document.getElementById('rmb').checked) {
		alert('Hai scelto di essere ricordato come uno stronzo');
	} else {
		alert('Hai scelto di essere scaricato');
	}
}

/*function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // aggiungi altri percorsi di default se necessario
        ...options
    };
    
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; domain=localhost";
    
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
        }
    }
    
    document.cookie = updatedCookie;
}*/

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
