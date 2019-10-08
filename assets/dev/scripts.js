+function ( $ ) {
	'use strict';

	$( document ).ready(function( $ ) {

		var scrollTo = function(elementSelector) {
			var $destination = $(elementSelector);

			$('html, body').animate({
				scrollTop: $destination.offset().top - 20
			}, 500);
		}

		// Scroll Action on Anchor Links 
		$(document).on('click','.anchorlink', function(event) {
			event.preventDefault();
			var section = $(this).attr('href');

			scrollTo(section);
		});



		// Set/get cookie

		var cookie = {
			set: function(cname, cvalue, exdays) {
			    var d = new Date();
			    var expires = '';
			    if (exdays) {
			    	d.setTime(d.getTime() + (24*60*60*1000 * exdays));
			    	expires = ';expires='+d.toUTCString();
			    }
			    document.cookie = cname + '=' + cvalue + expires + ';path=/';
			},
			get: function(cname) {
				var name = cname + '=';
				var ca = document.cookie.split(';');

				for(var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						return decodeURI(c.substring(name.length, c.length));
					}
				}

				return '';
			}
		}

		/* COOKIES */

		$(document.body).on('click', '#accept-cookies', function () {
			$('#cookies-notification').addClass('hidden');
			cookie.set('privacy_acceptance',1,90);

			setTimeout(function() {
	           $('#cookies-notification').remove();
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
