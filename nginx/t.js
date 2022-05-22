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

	// Menu On Hover
	// $('body').on('mouseenter mouseleave','.nav-item', function(e){
	// 	if ($(window).width() > 750) {
	// 		let _d=$(e.target).closest('.nav-item');
	// 		_d.addClass('show');
	// 		setTimeout(function(){
	// 			_d[_d.is(':hover')?'addClass':'removeClass']('show');
	// 		},1);
	// 	}
	// });
});
