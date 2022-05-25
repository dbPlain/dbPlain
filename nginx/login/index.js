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

	window.transitionToPage = function (href) {
		alert(href);
		setTimeout(function () {
			window.location.href = href;
		}, 500);
	};
});

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
