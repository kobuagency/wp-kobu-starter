+function ($) {
	'use strict';

	/* Common variables
	================================================== */

	var svgPlayButton = '<svg width="25" height="26" viewBox="0 0 25 26" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M24.1145,13.1885329 L1.5375,24.2894877 L1.5375,2.08757816 L24.1145,13.1885329 Z M21.9595,13.1885329 L2.5365,22.7387709 L2.5365,3.638295 L21.9595,13.1885329 Z" fill="#FDFBF8" stroke="none" stroke-width="1" fill-rule="evenodd"/></svg>';


	/* Embed videos
	================================================== */

	var youtubeLoaded = false,
		vimeoLoaded = false,
		youtubePlayers = {},
		vimeoPlayers = {},
		ytIframeAPIReady = false,
		player_num = 0,
		queueYoutubeVideo = [];

	// The API will call this function when the video player is ready.
	var onPlayerReady = function (event) {
		event.target.pauseVideo();

		var player_id = $(event.target.getIframe()).attr('id'),
			wrapperid = youtubePlayers[player_id].wrapperid,
			$wrapper = $('#' + wrapperid);

		$('#' + player_id).attr('title', event.target.getVideoData().title);
		$wrapper.removeClass('loading');

		$(document.body).on('click', '#' + wrapperid + '.paused .video-placeholder', function () {
			var current_button = $('#' + wrapperid + ' .play-video-btn');

			$wrapper.addClass('loading');

			event.target.playVideo();
			current_button.focus();
		});

		$(document.body).on('click', '#' + wrapperid + ' .play-video-btn', function () {
			if ($wrapper.hasClass('paused')) {
				$wrapper.addClass('loading');
				event.target.playVideo();
			} else {
				event.target.pauseVideo();
			}

			$wrapper.toggleClass('paused');
		});
	};

	var onPlayerStateChange = function (event) {
		var player_id = $(event.target.getIframe()).attr('id'),
			wrapperid = youtubePlayers[player_id].wrapperid,
			button = $('#' + wrapperid + ' .play-video-btn'),
			$player_wrapper = $('#' + wrapperid);

		if (event.data == YT.PlayerState.PLAYING) {
			button.attr('aria-label', _theme_config.strings.pause_video);
			$player_wrapper.removeClass('loading paused');

			if ($player_wrapper.hasClass('testimonial')) {
				$player_wrapper.closest('.patients-voices-top-wrapper').addClass('video-playing')
			}
		} else {
			button.attr('aria-label', _theme_config.strings.play_video);
			$player_wrapper.addClass('paused');

			if ($player_wrapper.hasClass('testimonial')) {
				$player_wrapper.closest('.patients-voices-top-wrapper').removeClass('video-playing')
			}
		}
	};

	var onPlayerError = function (event) {
		var player_id = $(event.target.getIframe()).attr('id'),
			wrapperid = youtubePlayers[player_id].wrapperid,
			$wrapper = $('#' + wrapperid);

		$wrapper.removeClass('paused loading');
		$('#' + wrapperid + ' .play-video-btn').remove();
	};

	/*

	// Destroy videos with ajax navigation

	var destroyYTvideo = function (player) {
		if (player) {
			player.video.stopVideo();
			player.video.clearVideo();

			player.video.removeEventListener('onReady', onPlayerReady);
			player.video.removeEventListener('onStateChange', onPlayerStateChange);
			player.video.removeEventListener('onError', onPlayerError);

			player.video.destroy();
			player.video = null;  // Clear out the reference to the destroyed player

			$(document.body).off('click', '#' + player.wrapperid + '.paused');
			$(document.body).off('click', '#' + player.wrapperid + ' .play-video-btn');
		}
	};

	var destroyVimeovideo = function (player) {
		if (player) {
			player.video.destroy();
			player.video = null;  // Clear out the reference to the destroyed player

			$(document.body).off('click', '#' + player.wrapperid + '.paused');
			$(document.body).off('click', '#' + player.wrapperid + ' .play-video-btn');
		}
	};

	var clearProviderEmbedVideos = function (players_arr, provider) {
		// for all properties of an object with proto chain
		var players = Object.getOwnPropertyNames(players_arr);
		for (var i = 0; i < players.length; i++) {
			if (provider == 'youtube') {
				destroyYTvideo(players_arr[players[i]]);
			} else if (provider == 'vimeo') {
				destroyVimeovideo(players_arr[players[i]]);
			}

			delete players_arr[players[i]];
		}
	};

	var clearEmbedVideos = function () {
		if (!$.isEmptyObject(youtubePlayers)) {
			clearProviderEmbedVideos(youtubePlayers, 'youtube');
		}
		if (!$.isEmptyObject(vimeoPlayers)) {
			clearProviderEmbedVideos(vimeoPlayers, 'vimeo');
		}
	};

	*/

	var initYoutubeVideo = function ($video) {
		var $player_wrapper = $video,
			$player = $player_wrapper.find('.iframe'),
			play_button,
			wrapper_id,
			player_id;

		$player_wrapper.addClass('paused loading');

		play_button = '<button type="button" class="play-video-btn" aria-label="' + _theme_config.strings.play_video + '">' + svgPlayButton + '</button>';

		$player_wrapper.prepend(play_button);

		player_id = 'player_' + player_num;
		wrapper_id = 'wrapper_' + player_id;

		$player.attr('id', player_id);
		$player_wrapper.attr('id', wrapper_id);

		var videosrc = $player.attr('data-iframe-src'),
			videoOrigin = window.location.origin,
			videoStart = $player.attr('data-iframe-start');

		youtubePlayers[player_id] = {
			'video': new YT.Player(player_id, {
				host: 'https://www.youtube.com',
				height: '360',
				width: '640',
				videoId: videosrc,
				playerVars: {
					'rel': 0,
					'origin': videoOrigin,
					'showinfo': 0,
					'modestbranding': 1,
					'start': videoStart,
					'playsinline': 1
				},
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange,
					'onError': onPlayerError
				}
			}),
			'wrapperid': wrapper_id
		};

		player_num++;
	}

	var initVimeoVideo = function ($video) {
		var $player_wrapper = $video,
			$player = $player_wrapper.find('.iframe'),
			play_button,
			wrapper_id,
			$button,
			player_id;

		$player_wrapper.addClass('paused loading');

		play_button = '<button type="button" class="play-video-btn" aria-label="' + _theme_config.strings.play_video + '">' + svgPlayButton + '</button>';

		$player_wrapper.prepend(play_button);

		$button = $player_wrapper.find('.play-video-btn');

		player_id = 'player_' + player_num;
		wrapper_id = 'wrapper_' + player_id;

		$player.attr('id', player_id);
		$player_wrapper.attr('id', wrapper_id);

		if (typeof Vimeo !== 'undefined') {
			var iframe = $('#' + player_id).get(0),
				vimeo_video = new Vimeo.Player(iframe);

			vimeoPlayers[player_id] = {
				'video': vimeo_video,
				'wrapperid': wrapper_id
			}

			vimeo_video.ready().then(function () {
				$player_wrapper.removeClass('loading');
			});

			// click events on vimeo

			$(document.body).on('click', '#' + wrapper_id + '.paused  .video-placeholder', function () {
				var current_button = $('#' + wrapper_id + ' .play-video-btn');

				$player_wrapper.addClass('loading');

				vimeo_video.play().then(function () {
					current_button.focus();
				}).catch(function (error) {
					console.error('error playing the video:', error.name);
				});
			});


			$(document.body).on('click', '#' + wrapper_id + ' .play-video-btn', function () {
				if ($player_wrapper.hasClass('paused')) {
					$player_wrapper.addClass('loading');
					vimeo_video.play();
				} else {
					vimeo_video.pause();
				}
			});

			vimeo_video.getVideoTitle().then(function (title) {
				$player.attr('title', title);
			});

			vimeo_video.on('play', function () {
				$player_wrapper.removeClass('loading paused');
				$button.attr('aria-label', _theme_config.strings.pause_video);
			});

			vimeo_video.on('pause', function () {
				$button.attr('aria-label', _theme_config.strings.play_video);
				$player_wrapper.addClass('paused');
			});
		} else {
			$('.wp-block-embed.is-provider-vimeo').removeClass('loading paused');
			$('.wp-block-embed.is-provider-vimeo .play-video-btn').remove();
		}

		player_num++;
	}

	var onYouTubeIframeAPIReady = function () {
		ytIframeAPIReady = true;

		if (queueYoutubeVideo) {
			var i;
			for (i = 0; i < queueYoutubeVideo.length; ++i) {
				initYoutubeVideo(queueYoutubeVideo[i]);
			}
		}
	};

	window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;


	/* Load videos with intersection observer
	================================================== */

	var loadVideo = function ($video) {
		$video.removeClass('not-loaded');

		if ($video.hasClass('youtube')) {
			if (!youtubeLoaded) {
				$.when(
					$.getScript('https://www.youtube.com/iframe_api'),
					$.Deferred(function (deferred) {
						$(deferred.resolve);
					})
				).done(function () {
					youtubeLoaded = true;

					if (ytIframeAPIReady) {
						initYoutubeVideo($video);
					} else {
						queueYoutubeVideo.push($video)
					}
				});
			} else {
				if (ytIframeAPIReady) {
					initYoutubeVideo($video);
				} else {
					queueYoutubeVideo.push($video)
				}
			}
		} else if ($video.hasClass('vimeo')) {
			if (!vimeoLoaded) {
				$.when(
					$.getScript(_theme_config.theme_path + '/assets/third-party/vimeo/vimeo_player.min.js'),
					$.Deferred(function (deferred) {
						$(deferred.resolve);
					})
				).done(function () {
					vimeoLoaded = true;
					initVimeoVideo($video);
				});
			} else {
				initVimeoVideo($video);
			}
		}
	}

	$(document.body).on('click', '.embed-container.not-loaded', function () {
		var $video = $(this);
		loadVideo($video);
	});

	var videoIntersectionObserver;

	var videoOnIntersection = function (entries) {
		entries.forEach(function (entry) {
			// Mitigation for EDGE lacking support of .isIntersecting until v15, compare to e.g. https://github.com/w3c/IntersectionObserver/issues/211#issuecomment-309144669
			if (entry.intersectionRatio === 0) {
				return;
			}

			// If the item is visible now, load it and stop watching it
			var targetElem = entry.target;
			videoIntersectionObserver.unobserve(targetElem);

			var $video = $(targetElem);
			loadVideo($video);
		});
	}


	/* Check video support
	================================================== */

	var supportsVideoType = function (type) {
		var video;

		var formats = {
			ogg: 'video/ogg; codecs="theora"',
			h264: 'video/mp4; codecs="avc1.42E01E"',
			webm: 'video/webm; codecs="vp8, vorbis"',
			vp9: 'video/webm; codecs="vp9"',
			hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
		};

		if (!video) {
			video = document.createElement('video')
		}

		if (video.canPlayType) {
			return video.canPlayType(formats[type] || type);
		} else {
			return false;
		}
	};

	/* Load custom videos
	================================================== */

	var loadCustomVideos = function () {
		$('.pageload-video:not(.video-loaded)').each(function () {
			var $this = $(this),
				settings = $this.data('settings');

			$this.addClass('video-loaded');

			var error = 0,
				videoSrc,
				videoFormat;

			if (settings.webm && supportsVideoType('vp9')) {
				videoSrc = settings.webm;
				videoFormat = 'webm';
			} else if (settings.mp4 && supportsVideoType('h264')) {
				videoSrc = settings.mp4;
				videoFormat = 'mp4';
			} else if (settings.ogg && supportsVideoType('ogg')) {
				videoSrc = settings.ogg;
				videoFormat = 'ogg';
			} else {
				error++;
			}

			var placeholder = $this.find('.video-placeholder');

			if (placeholder.length) {
				placeholder.wrap('<div class="video-wrapper"></div>');
			} else {
				$this.prepend('<div class="video-wrapper"></div>');
			}

			var videoWrapper = $this.find('.video-wrapper');

			if (!error) {
				var video = document.createElement('video');
				video.autoplay = settings.autoplay;
				video.controls = settings.controls;
				video.loop = settings.loop;
				video.muted = settings.muted;
				video.preload = settings.preload;
				video.playsinline = true;

				if (settings.autoplay) {
					video.setAttribute('autoplay', '');
				}

				var videoSource = document.createElement('source');
				videoSource.type = 'video/' + videoFormat;
				videoSource.src = videoSrc;

				video.appendChild(videoSource);

				if (settings.track) {
					var videoTrack = document.createElement('track');
					videoTrack.kind = settings.trackKind;
					videoTrack.srclang = settings.trackSrclang;
					videoTrack.default = true;
					videoTrack.src = settings.track;

					video.appendChild(videoTrack);
				}

				videoWrapper.append(video);
				videoWrapper.find('video').get(0).load();

				if (video.controls && !settings.autoplay) {
					videoWrapper.kobuvideo({ svgbutton: svgPlayButton, fullscreen: false });
				} else {
					var videoElem = videoWrapper.find('video').get(0);

					if (!videoElem.paused) {
						if (placeholder.length) {
							placeholder.remove();
						}
					} else {
						videoWrapper.kobuvideo({ svgbutton: svgPlayButton, fullscreen: false });
					}
				}
			} else {
				videoWrapper.addClass('error'); // Your browser cannot play this video
			}
		});
	};


	/* Document ready
	================================================== */

	$(document).ready(function ($) {
		$('body').addClass('js-loaded');

		/* Update vh value
		================================================== */

		var updateVh = function () {
			var vh = $(window).height() * 0.01;
			document.documentElement.style.setProperty('--vh', vh + 'px');
		}

		updateVh();


		/* Anchorlinks
		================================================== */

		var scrollTo = function (target, afterFunction) {
			afterFunction = afterFunction || null;
			var $destination = target;

			if (typeof target !== 'number') {
				if ($(target).length) {
					$destination = $(target).offset().top;
				} else {
					return;
				}
			}

			$('html, body').animate({
				scrollTop: $destination
			}, 500, afterFunction);
		}

		// Scroll Action on Anchor Links 
		$(document).on('click', 'a.anchorlink, .anchorlink a', function (event) {
			event.preventDefault();
			var section = $(this).attr('href');

			scrollTo(section);
		});


		/* Cookies
		================================================== */

		var cookie = {
			set: function (cname, cvalue, exdays) {
				var d = new Date();
				var expires = '';
				if (exdays) {
					d.setTime(d.getTime() + (24 * 60 * 60 * 1000 * exdays));
					expires = ';expires=' + d.toUTCString();
				}
				document.cookie = cname + '=' + cvalue + expires + ';path=/';
			},
			get: function (cname) {
				var name = cname + '=';
				var ca = document.cookie.split(';');

				for (var i = 0; i < ca.length; i++) {
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

		$(document.body).on('click', '#accept-cookies', function () {
			$('#cookies-notification').addClass('hidden');
			cookie.set('privacy_acceptance', 1, 90);

			setTimeout(function () {
				$('#cookies-notification').remove();
			}, 500);
		});


		/* Embed Videos
		================================================== */

		if ('IntersectionObserver' in window) {
			var config = {
				rootMargin: '0px 0px 0px 0px',
				threshold: 0.01
			};

			if (typeof videoIntersectionObserver === 'undefined') {
				videoIntersectionObserver = new IntersectionObserver(videoOnIntersection, config);
			}

			$('.embed-container.not-loaded').each(function () {
				var video = $(this).get(0);

				videoIntersectionObserver.observe(video);
			});
		}


		/* Local Videos
		================================================== */

		$('.kb-video:not(.pageload-video) .video-wrapper, .wp-block-video').kobuvideo({ svgbutton: svgPlayButton, fullscreen: false });


		/* Slick Gallery
		================================================== */

		function initializeSlick(gallery) {
			gallery.imagesLoaded(function () {
				gallery.on('init reInit', function (event, slick) {
					var galleryWrapper = gallery.closest('.slider-wrapper, .slider-gallery');

					if (galleryWrapper.find('.slick-pagination').length === 0) {
						galleryWrapper.append('<div class="slick-pagination"><span>1</span> / ' + slick.slideCount + '</div>');
					}

					galleryWrapper.removeClass('hidden');
				});

				gallery.on('reInit beforeChange', function (event, slick, currentSlide, nextSlide) {
					var i = (nextSlide ? nextSlide : 0) + 1;

					gallery.closest('.slider-wrapper, .slider-gallery').find('.slick-pagination span').text(i);
				});

				gallery.slick({
					dots: false,
					arrows: true,
					infinite: true,
					speed: 600,
					slidesToScroll: 1,
					adaptiveHeight: true,
					responsive: [
						{
							breakpoint: 1200,
							settings: {
								dots: false,
							}
						},
					]
				});
			});
		}

		var galleries = $('.gallery');
		if (galleries.length > 0) {
			galleries.each(function () {
				initializeSlick($(this));
			});
		}


		/* Responsive Spacer
		================================================== */

		var returnHeight = function (elem, width) {
			var spacer = elem,
				height;

			if (width <= 768) {
				height = spacer.attr('data-small');
			} else if (width >= 1900) {
				height = spacer.attr('data-large');
			} else {
				height = spacer.attr('data-medium');
			}

			if (height) {
				height = parseInt(height, 10);
			} else {
				height = 0;
			}

			return height;
		}

		var customHeightSpacer = function () {
			$('.responsive-spacer.size-custom').each(function () {
				var spacer = $(this),
					height = returnHeight(spacer, $(window).width());

				spacer.css('height', height);
			});
		}

		customHeightSpacer();


		/* wpcf7mailsent event
		================================================== */

		$(document.body).off('wpcf7mailsent').on('wpcf7mailsent', function (event) {
			var formId = event.detail.id;

			if (window.ga) {
				if ($('#' + formId + ' input.eventCategory').length && $('#' + formId + ' input.eventAction').length && $('#' + formId + ' input.eventLabel').length) {
					var eventCategory = $('#' + formId + ' input.eventCategory').val();
					var eventAction = $('#' + formId + ' input.eventAction').val();
					var eventLabel = $('#' + formId + ' input.eventLabel').val();
					ga('send', 'event', eventCategory, eventAction, eventLabel);
				}
			}
		});

		
		/* Resize event
		================================================== */

		$(window).on('resize', function () {
			updateVh();
			customHeightSpacer();
		});
	});


	/* Window onload
	================================================== */

	$(window).on('load', function () {
		loadCustomVideos();


		/* webp Polyfill
		================================================== */

		Modernizr.on('webp', function (result) {
			if (!result) {
				$.when(
					$.getScript("https://unpkg.com/webp-hero@0.0.0-dev.27/dist-cjs/polyfills.js"),
					$.getScript("https://unpkg.com/webp-hero@0.0.0-dev.27/dist-cjs/webp-hero.bundle.js"),
					$.Deferred(function (deferred) {
						$(deferred.resolve);
					})
				).done(function () {
					// Support for webp
					$('img[src$=".webp"]').each(function () {
						$(this).attr('srcset', '');
					});

					var webpMachine = new webpHero.WebpMachine();
					webpMachine.polyfillDocument()

					$(document).on('lazyLoadReplace', function (event) {
						webpMachine.polyfillImage(event.target);
						$(event.target).attr('srcset', '');
					});
				});
			}
		});
	});

}(jQuery);
