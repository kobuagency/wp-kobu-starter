+function ( $ ) {
	'use strict';

	$( document ).ready(function( $ ) {

		function scrollTo(elementSelector) {
			var $destination = $(elementSelector);

			$("html, body").animate({
				scrollTop: $destination.offset().top - 20
			}, 500);
		}

		// Scroll Action on Anchor Links 
		$(document).on('click','.anchorlink', function(event) {
			event.preventDefault();
			var section = $(this).attr('href');

			scrollTo(section);
		});



		/* COOKIES */

		function setCookie(cname, cvalue, exdays) {
		    var d = new Date();
		    d.setTime(d.getTime() + (24*60*60*1000 * exdays));
		    var expires = "expires="+d.toUTCString();
		    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		}

		$(document.body).on('click', '#accept-cookies', function () {
			$('#cookies-notification').addClass('hidden');

			setTimeout(function() {
	           setCookie('privacy_acceptance',1,90)
	        }, 500);
	    });



	    // Slick gallery

	    $('.gallery').slick({
			dots: false,
			arrows: true,
			infinite: true,
			speed: 600,
			slidesToScroll: 1,
			fade: true,
			cssEase: 'linear'
		});

	});

}(jQuery);
