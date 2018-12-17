+function ( $ ) {
	'use strict';

	$(window).load(function() {
		var ajaxLock = false,
			page_num =  2,
			post_type = 'post';


		function ajax_filters() {
			if( ! ajaxLock ) {
		    	ajaxLock = true;
		    	$('#ajax-loading').removeClass('hidden');

		        $.ajax({
					url: ajaxfilters.ajaxurl,
					data: "action=ajax_filters&page_num="+page_num+"&post_type="+post_type,
					type: "post",

					success:function(data){
						var $items = $(data);

						$items.imagesLoaded().done( function() {
							$('#posts-container').append(data);

							$('.gallery:not(.slick-initialized)').slick({
								dots: false,
								arrows: true,
								infinite: true,
								speed: 600,
								slidesToScroll: 1,
								fade: true,
								cssEase: 'linear'
							});

							if ($('.has-more').length) {
								$('.has-more').remove();
								page_num++;
								$('.load-more').attr('data-page', page_num);
							} else {
								$('.load-more').remove();
							}

							$('#ajax-loading').addClass('hidden');

							ajaxLock = false;
						});
					},

		            //Ajax call is not successful, still remove lock in order to try again
		            error: function () {
		                ajaxLock = false;
		            }
				});

				return false;
		    }
		}


		$(document).on('click', '.load-more', function(event){
			event.preventDefault();

			if( ! ajaxLock ) {
				page_num = $(this).attr('data-page');
				post_type = $(this).attr('data-post');
				ajax_filters();
			}
		});
	});
}(jQuery);