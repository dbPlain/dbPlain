$(function () {
	/* display nav (service-login/logout) */
	// service non accessibile
	$('#entra_db').attr('style', 'pointer-events: none');
	$('#entra_db_genitore').removeClass('nav-item');
	$('#entra_db').addClass('link-not-clickable');
	// check se l'utente è loggato (e quindi se ha il cookie)
	let prova = decodeURIComponent(document.cookie);
	let provasub = prova.substring(prova.indexOf('{'), prova.length);
	let datiUtente;
	try {
		datiUtente = JSON.parse(provasub).docs[0];
	} catch (e) {
		datiUtente = null;
		console.log(JSON.stringify(e));
	}
	if (datiUtente) {
		// è loggato, allora..
		// service accessibile
		$('#entra_db').removeAttr('style');
		$('#entra_db_genitore').addClass('nav-item');
		$('#entra_db').removeClass('link-not-clickable');

		// login -> diventa logout (grafica)
		$('#login-nav').addClass('invisible');
		$('#logout-nav').removeClass('invisible');
	}
	// logout logica
	$('#logout-nav').on('click', function () {
		setCookie('datiUtente', '', -1);

		// service non accessibile
		$('#entra_db').attr('style', 'pointer-events: none');
		$('#entra_db_genitore').removeClass('nav-item');
		$('#entra_db').addClass('link-not-clickable');
		// logout -> diventa login
		$('#login-nav').removeClass('invisible');
		$('#logout-nav').addClass('invisible');
	});

	// Animation
	$('body.hero-anime').removeClass('hero-anime');

	// Responsive Navbar desktop
	let header = $('#navbar-res');
	$(window).on('scroll', function () {
		let scroll = $(window).scrollTop();

		if (scroll >= 10) {
			header.addClass('scroll-on');
		} else {
			header.removeClass('scroll-on');
		}
	});

	// Navigation on mobile
	let body = undefined;
	let menu = undefined;
	let menuItems = undefined;
	var init = function init() {
		body = document.querySelector('body');
		menu = document.querySelector('.menu-icon');
		menuItems = document.querySelectorAll('.nav__list-item');
		applyListeners();
	};
	var applyListeners = function applyListeners() {
		menu.addEventListener('click', function () {
			return toggleClass(body, 'nav-active');
		});
	};
	var toggleClass = function toggleClass(element, stringClass) {
		if (element.classList.contains(stringClass)) element.classList.remove(stringClass);
		else element.classList.add(stringClass);
	};
	init();
	// se lo schermo si ingrandisce e body ha ancora la classe nav-active
	// (perché l'utente non l'ha tolta ripremendo l'icona a destra), then togliere la classe
	$(window).on('resize', function () {
		if ($(window).width() > 767 && body.classList.contains('nav-active')) body.classList.remove('nav-active');
	});

	// Parallax
	function scrollBanner() {
		$(document).on('scroll', function () {
			var scrollPos = $(this).scrollTop();
			$('.parallax-fade-top').css({
				top: scrollPos / 2 + 'px',
				opacity: 1 - scrollPos / 700,
			});
			$('.parallax-00').css({
				top: scrollPos / -3.5 + 'px',
			});
			$('.parallax-01').css({
				top: scrollPos / -2.8 + 'px',
			});
			$('.parallax-top-shadow').css({
				top: scrollPos / -2 + 'px',
			});
		});
	}
	scrollBanner();

	// span works like a link (ci serve ancora?)
	window.transitionToPage = function (href) {
		$('.navigation-wrap').addClass('navigation-back');

		setTimeout(function () {
			window.location.href = href;
		}, 500);
	};
});

// https://www.google.com/search?q=how+to+refresh+page+every+time+you+go+backwards+one+page&client=ubuntu&hs=ljs&channel=fs&ei=bKCLYsz5CK6C9u8Pk6uK6AE&oq=how+to+refresh+page+every+time+you+go+backward&gs_lcp=Cgdnd3Mtd2l6EAMYATIFCCEQoAEyBQghEKABMgUIIRCgAToHCAAQRxCwAzoLCAAQgAQQsQMQgwE6EQguEIAEELEDEIMBEMcBEKMCOggIABCABBCxAzoICC4QgAQQ1AI6CwguELEDEIMBENQCOgsILhCABBCxAxCDAToFCC4QgAQ6CAguELEDEIMBOhEILhCABBCxAxCDARDHARDRAzoKCC4QxwEQ0QMQQzoECAAQQzoICC4QgAQQsQM6CAgAELEDEIMBOgUIABCABDoFCAAQsQM6BggAEB4QFjoECAAQEzoICAAQHhAWEBM6CAghEB4QFhAdOgcIIRAKEKABOgQIIRAVOgoIIRAeEA8QFhAdSgQIQRgASgQIRhgAUPoPWNxPYNhaaARwAXgBgAGWAogBgDeSAQYwLjQ0LjOYAQCgAQHIAQjAAQE&sclient=gws-wiz
// https://stackoverflow.com/questions/43043113/how-to-force-reloading-a-page-when-using-browser-back-button
// window.addEventListener( "pageshow", function ( event ) {
// 	var historyTraversal = event.persisted ||
// 						   ( typeof window.performance != "undefined" &&
// 								window.performance.timeOrigin.type === 2);
// 	if ( historyTraversal ) {
// 	  window.location.reload();
// 	}
// });

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	let expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
