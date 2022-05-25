$(function () {
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

	// span works like a link
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
