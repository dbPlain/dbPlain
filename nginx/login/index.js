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
});