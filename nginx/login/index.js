// appena finisce di caricare il DOM
// uguale a "$(document).ready(function()" deprecated
$(function () {
	// a inizio caricamento
	if ($('input.checkbox').is(':checked')) {
		// Underline signup/login
		$('.signup-text').addClass('signup-checked');
		$('.login-text').removeClass('login-checked');

		// sinup/login text per cambiare form
		$('#login-click').attr({ for: 'reg-log' });
		$('#signup-click').removeAttr('for');
	} else {
		$('.signup-text').removeClass('signup-checked');
		$('.login-text').addClass('login-checked');

		$('#signup-click').attr({ for: 'reg-log' });
		$('#login-click').removeAttr('for');
	}
	// ogni volta che cambia la checkbox (dinamicamente)
	$('.checkbox:checkbox').on('change', function () {
		if ($(this).is(':checked')) {
			$('.signup-text').addClass('signup-checked');
			$('.login-text').removeClass('login-checked');

			$('#login-click').attr({ for: 'reg-log' });
			$('#signup-click').removeAttr('for');
		} else {
			$('.signup-text').removeClass('signup-checked');
			$('.login-text').addClass('login-checked');

			$('#signup-click').attr({ for: 'reg-log' });
			$('#login-click').removeAttr('for');
		}
	});

	// check utente esistente
	$('#error_panel').addClass('non-visibile');
	$('#login-form').on('submit', function (e) {
		e.preventDefault(); // avoid to execute the actual submit of the form
		let form = $(this);

		$.ajax({
			type: 'POST',
			url: '/autenticazione',
			data: form.serialize(),
			success: function (data) {
				// utente trovato e password corretta
				let red = JSON.parse(data).redirect;
				window.location.replace(red);
			},
			statusCode: {
				// utente trovato nel db, ma password inserita sbagliata
				401: function (data) {
					$('#error_panel').removeClass('non-visibile');
					$('#error_panel').html('password errata');
					$('#submit-btn-login').removeClass('mt-4').addClass('mt-2');
					setTimeout(function () {
						$('#error_panel').addClass('non-visibile');
						$('#submit-btn-login').addClass('mt-4').removeClass('mt-2');
					}, 4000);
				},
				// utente non trovato nel db
				404: function (data) {
					$('#error_panel').removeClass('non-visibile');
					$('#error_panel').html('utente non trovato');
					$('#submit-btn-login').removeClass('mt-4').addClass('mt-2');
					setTimeout(function () {
						$('#error_panel').addClass('non-visibile');
						$('#submit-btn-login').addClass('mt-4').removeClass('mt-2');
					}, 4000);
					// JSON.parse(data.responseText).errore
				},
			},
		});
	});

	// let prova = decodeURIComponent(document.cookie);
	// console.log(prova);

	// if (prova != undefined) var provasub = prova.substring(prova.indexOf('{'), prova.length);

	// if (provasub != '') var valori = JSON.parse(provasub);

	// $(document).ready(function () {
	// 	var richiestacookie = new XMLHttpRequest();
	// 	richiestacookie.open('post', 'http://localhost:8080/updatecookie', true);
	// 	richiestacookie.onload = function () {};
	// 	richiestacookie.send();
	// 	$('#errorp').hide();
	// 	if (valori != null && valori.errore) {
	// 		$('#errorp').show();
	// 	}
	// 	document.cookie = 'name=document.cookie;max-age=0';
	// });

	// tag span si comporta come tag a (non più necessario in teoria)
	window.transitionToPage = function (href) {
		alert(href);
		setTimeout(function () {
			window.location.href = href;
		}, 500);
	};
});

// transizione iniziale
window.onload = () => {
	const anchor = document.querySelector('.logo');
	const transition_el = document.querySelector('.transition');

	setTimeout(() => {
		transition_el.classList.remove('is-active');
	}, 500);

	anchor.addEventListener('click', (e) => {
		e.preventDefault();

		transition_el.classList.add('is-active');

		setInterval(() => {
			window.location.href = anchor.href;
		}, 500);
	});
};
