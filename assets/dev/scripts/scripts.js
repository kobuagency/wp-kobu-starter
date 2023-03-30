+function ($) {
	'use strict';

	/* Common variables
	================================================== */

	var svgPlayButton = '<svg width="25" height="26" viewBox="0 0 25 26" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M24.1145,13.1885329 L1.5375,24.2894877 L1.5375,2.08757816 L24.1145,13.1885329 Z M21.9595,13.1885329 L2.5365,22.7387709 L2.5365,3.638295 L21.9595,13.1885329 Z" fill="#FDFBF8" stroke="none" stroke-width="1" fill-rule="evenodd"/></svg>';
	var sliderArrow = 'M64.2829018,0 L24.8248333,39.462185 C18.6063594,45.675353 18.399077,55.6270856 24.2018636,62.0883694 L24.8235909,62.7440306 L58.4631224,96.3835622 C63.2850395,101.205479 71.1018779,101.205479 75.923795,96.3835622 C80.5528354,91.7545218 80.737997,84.3653619 76.4792798,79.5155119 L75.923795,78.9228896 L45.1942291,48.1933237 L39.3734189,54.0141339 L70.1029848,84.7436998 C71.7101572,86.3508722 71.7101572,88.9555796 70.1029848,90.562752 C68.6194411,92.0462957 66.2859267,92.1604145 64.6716182,90.9051082 L64.2839326,90.562752 L30.6431586,56.9219785 C27.5975149,53.8789335 27.4372179,49.0407038 30.163453,45.807507 L30.6445529,45.2840853 L70.1040156,5.82050663 L64.2829018,0 Z';


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


	/* Sliders
	================================================== */

	var galleryIntersectionObserver,
		sliders_arr = [];

	var galleryOnIntersection = function (entries) {
		entries.forEach(function (entry) {
			var targetElem = entry.target;

			if (entry.intersectionRatio === 0) {
				return;
			}

			var current_slider_obj = sliders_arr[$(targetElem).attr('data-slide')];

			if (current_slider_obj) {
				current_slider_obj.update();
			}

			// If the item is visible now, stop watching it
			galleryIntersectionObserver.unobserve(targetElem);
		});
	}

	function pad(num, size) {
		num = num.toString();
		while (num.length < size) {
			num = '0' + num;
		}
		return num;
	}

	function createElem(elem, className) {
		var div = document.createElement(elem);
		var classNames = className.split(' ');
		classNames.forEach(function (name) {
			div.classList.add(name);
		});
		return div;
	}

	function removeElement(elment) {
		elment.parentNode.removeChild(elment);
	}

	var getSliderTotalWidth = function (slider, selector) {
		var selector_arr = Array.from(slider.querySelectorAll(selector));
		if (selector_arr.length > 0) {
			return selector_arr.map(function (slide) {
				return slide.offsetWidth;
			}).reduce(function (total, width) {
				return total + width;
			});
		} else {
			return 0;
		}
	}

	var checkIfDisabled = function (slider) {
		var plugins_settings = slider.options.plugins_settings;

		function addRemoveDisabledClass() {
			var slides_count = slider.track.details.slides.length;

			if (plugins_settings.multiple) {
				var slider_width = getSliderTotalWidth(slider.container, '.slide:not(.clone), .article:not(.clone), .product:not(.clone)') - 10;

				if (slider_width <= $(slider.container).width()) {
					slider.container.classList.add('disabled-slider');

					if (slider.parentcontainer) {
						slider.parentcontainer.classList.add('disabled-slider');
					}
				} else {
					slider.container.classList.remove('disabled-slider');

					if (slider.parentcontainer) {
						slider.parentcontainer.classList.remove('disabled-slider');
					}

					if (!$(slider.container).hasClass('cloned') && plugins_settings.loop) {
						if ((slider_width - (slider_width / slides_count)) <= $(slider.container).width()) {
							var slides = $(slider.container).find('.slide:not(.clone), .article:not(.clone), .product:not(.clone)');

							var clones = slides.clone().addClass('clone').attr('aria-hidden', true);
							slides.last().after(clones);
							$(slider.container).addClass('cloned');
						}
					}
				}
			} else {
				if (slides_count == 1) {
					slider.container.classList.add('disabled-slider');
				}
			}
		}

		if (plugins_settings.multiple) {
			slider.on("created", addRemoveDisabledClass);
			slider.on("updated", addRemoveDisabledClass);

			imagesLoaded(slider.container, function () {
				addRemoveDisabledClass();
				slider.update();
			});
		} else {
			slider.on("created", addRemoveDisabledClass);
		}
	};

	var keyboardControls = function (slider) {
		var focused = false;

		function eventFocus() {
			focused = true;
		}

		function eventBlur() {
			focused = false;
		}

		function eventKeydown(e) {
			if (!focused) { return; }
			switch (e.key) {
				default:
					break;
				case 'Left':
				case 'ArrowLeft':
					slider.prev();
					break;
				case 'Right':
				case 'ArrowRight':
					slider.next();
					break;
			}
		}

		slider.on('created', function () {
			slider.container.setAttribute('tabindex', 0);
			slider.container.addEventListener('focus', eventFocus);
			slider.container.addEventListener('blur', eventBlur);
			slider.container.addEventListener('keydown', eventKeydown);
		});
		slider.on('dragStarted', function () {
			eventFocus();
		});
		slider.on('destroyed', function () {
			slider.container.removeEventListener('focus', eventFocus);
			slider.container.removeEventListener('blur', eventBlur);
			slider.container.removeEventListener('keydown', eventKeydown);
		})
	};

	var navigation = function (slider) {
		var wrapper, innerWrapper, dots, arrowLeft, arrowRight, pagination, hasMarkup;

		function arrowMarkup(remove) {
			if (remove) {
				removeElement(arrowLeft);
				removeElement(arrowRight);
				return;
			}
			arrowLeft = createElem('button', 'arrow arrow--left');
			arrowLeft.setAttribute('type', 'button');
			arrowLeft.setAttribute('aria-label', _theme_config.strings.previous);
			arrowLeft.addEventListener('click', function () {
				slider.prev();
			});
			arrowRight = createElem('button', 'arrow arrow--right')
			arrowRight.setAttribute('type', 'button');
			arrowRight.setAttribute('aria-label', _theme_config.strings.next);
			arrowRight.addEventListener('click', function () {
				slider.next();
			});

			var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('viewBox', '0 0 100 100');
			svg.setAttribute('height', '25px');
			svg.setAttribute('width', '25px');
			svg.classList.add('button-icon');

			var right_svg = svg.cloneNode(true);

			var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); //Create a path in SVG's namespace
			path.setAttribute('d', sliderArrow);

			var right_path = path.cloneNode(true);
			right_path.setAttribute('transform', 'translate(100, 100) rotate(180)');

			svg.appendChild(path);
			right_svg.appendChild(right_path);

			arrowLeft.appendChild(svg);
			arrowRight.appendChild(right_svg);

			innerWrapper.appendChild(arrowLeft);
			innerWrapper.appendChild(arrowRight);
		}

		function dotMarkup(remove) {
			if (remove) {
				removeElement(dots);
				return;
			}
			dots = createElem('div', 'dots');
			slider.track.details.slides.forEach(function (_e, idx) {
				var dot = createElem('div', 'dot');
				dot.addEventListener('click', function () {
					slider.moveToIdx(idx);
				});
				dots.appendChild(dot);
			})
			innerWrapper.appendChild(dots);
		}

		function paginationMarkup(remove) {
			if (remove) {
				removeElement(pagination);
				return;
			}
			var slide = slider.track.details.rel;
			pagination = createElem('div', 'pagination');

			var slides_count = slider.track.details.slides.length;
			if (slider.container.classList.contains('cloned')) {
				slides_count = slides_count / 2;
			}

			var pagination_text = document.createTextNode(pad(slide + 1, 2) + '/' + pad(slides_count, 2));
			pagination.appendChild(pagination_text);

			innerWrapper.appendChild(pagination);
		}

		function wrapperMarkup(remove) {
			if (remove) {
				var parent = wrapper.parentNode;
				while (wrapper.firstChild) {
					parent.insertBefore(wrapper.firstChild, wrapper);
				}

				delete slider.parentcontainer;

				removeElement(innerWrapper);
				removeElement(wrapper);
				return;
			}
			wrapper = createElem('div', 'gallery-navigation-wrapper');
			var plugins_settings = slider.options.plugins_settings;

			slider.container.parentNode.insertBefore(wrapper, slider.container);
			wrapper.appendChild(slider.container);

			var element_classes = slider.container.className.split(' ');
			var exclude = ['keen-slider', 'animate', 'animated'];

			element_classes = element_classes.filter(function (item) {
				return !exclude.includes(item);
			});

			var cl = wrapper.classList;
			cl.add.apply(cl, element_classes);

			innerWrapper = createElem('div', 'gallery-inner-navigation-wrapper');
			wrapper.appendChild(innerWrapper);

			if (plugins_settings.dots) {
				wrapper.classList.add('has-dots-pagination');
			}

			slider.parentcontainer = wrapper;
		}

		function updateClasses() {
			if (hasMarkup) {
				var slide = slider.track.details.rel;
				var plugins_settings = slider.options.plugins_settings;

				if (plugins_settings.arrows && !plugins_settings.loop) {
					if (slide === 0) {
						arrowLeft.classList.add('arrow--disabled');
					} else {
						arrowLeft.classList.remove('arrow--disabled');
					}

					if (slide === slider.track.details.slides.length - 1 || slider.track.details.progress === 1) {
						arrowRight.classList.add('arrow--disabled');
					} else {
						arrowRight.classList.remove('arrow--disabled');
					}
				}

				if (plugins_settings.dots) {
					Array.from(dots.children).forEach(function (dot, idx) {
						if (idx === slide) {
							dot.classList.add('dot--active');
						} else {
							dot.classList.remove('dot--active');
						}
					});
				}

				if (plugins_settings.pagination) {
					var slides_count = slider.track.details.slides.length;
					if (slider.container.classList.contains('cloned')) {
						slides_count = slides_count / 2;
					}

					pagination.textContent = pad(slide + 1, 2) + '/' + pad(slides_count, 2);
				}
			}
		}

		function markup(remove) {
			var plugins_settings = slider.options.plugins_settings;

			wrapperMarkup(remove);

			if (plugins_settings.dots) {
				dotMarkup(remove)
			}
			if (plugins_settings.arrows) {
				arrowMarkup(remove);
			}
			if (plugins_settings.pagination) {
				paginationMarkup(remove);
			}

			hasMarkup = true;
		}

		slider.on('created', function () {
			markup()
			updateClasses()
		})
		slider.on('optionsChanged', function () {
			markup(true);
			markup();
			updateClasses();
		})
		slider.on('slideChanged', function () {
			updateClasses();
		})
		slider.on('detailsChanged', function () {
			updateClasses();
		})
		slider.on('destroyed', function () {
			markup(true);
		})
	}

	var activeSlide = function (slider) {
		function removeActive() {
			slider.slides.forEach(function (slide) {
				slide.classList.remove('active');
			});
		}
		function addActive(idx) {
			slider.slides[idx].classList.add('active');
		}

		slider.on('created', function () {
			addActive(slider.track.details.rel);

			slider.on('animationStarted', function () {
				removeActive();

				var next = slider.animator.targetIdx || 0;
				addActive(slider.track.absToRel(next));
			})
		})
	};

	var initializeGallery = function (gallery, plugins_settings, options, aditional_plugins) {
		var slider;
		var plugins;

		var defaults_plugins_settings = {
			multiple: false,
			pagination: false,
			dots: true,
			arrows: true,
			loop: true,
			center: false
		}

		if (plugins_settings) {
			plugins_settings = $.extend({}, defaults_plugins_settings, plugins_settings);
		}

		if (!options || jQuery.isEmptyObject(options)) {
			if (plugins_settings.multiple) {
				options = {
					selector: '.slide, li',
					loop: plugins_settings.loop,
					mode: 'free-snap',
					slides: {
						perView: 'auto'
					},
					defaultAnimation: {
						duration: 800
					}
				}
			} else {
				options = {
					selector: '.slide, li',
					loop: plugins_settings.loop,
					defaultAnimation: {
						duration: 1600
					}
				}
			}

			if (plugins_settings.center) {
				if (!options.slides) {
					options.slides = {};
				}

				options.slides.origin = 'center';
			}
		}

		options.plugins_settings = plugins_settings;

		plugins = [keyboardControls, activeSlide];

		if (aditional_plugins) {
			$.merge(plugins, aditional_plugins);
		}

		if (plugins_settings.multiple) {
			plugins.push(checkIfDisabled);
		}

		if (plugins_settings.pagination || plugins_settings.dots || plugins_settings.arrows) {
			plugins.push(navigation);
		}

		slider = new KeenSlider(gallery, options, plugins);
		sliders_arr.push(slider);

		if ('IntersectionObserver' in window) {
			var config = {
				rootMargin: '0px 0px 0px 0px',
				threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.00]
			};

			if (typeof galleryIntersectionObserver === 'undefined') {
				galleryIntersectionObserver = new IntersectionObserver(galleryOnIntersection, config);
			}
			galleryIntersectionObserver.observe(gallery);
		}
	}

	function initSlider(elements, plugins_settings, options, aditional_plugins) {
		if (elements.length > 0) {
			elements.each(function () {
				if (!$(this).hasClass('keen-slider')) {
					$(this).addClass('keen-slider');
					$(this).attr('data-slide', sliders_arr.length);
					initializeGallery(this, plugins_settings, options, aditional_plugins);
				}
			});
		}
	}

	var initSliders = function () {
		initSlider($('.slider-gallery.multiple.with-pagination .gallery'), { multiple: true, pagination: true, dots: false, arrows: true, loop: true });
		initSlider($('.slider-gallery.multiple:not(.with-pagination) .gallery'), { multiple: true, pagination: false, dots: false, arrows: true, loop: true });
		initSlider($('.slider-gallery:not(.multiple).with-pagination .gallery'), { multiple: false, pagination: true, dots: false, arrows: true, loop: true });
		initSlider($('.slider-gallery:not(.multiple):not(.with-pagination) .gallery'), { multiple: false, pagination: false, dots: false, arrows: true, loop: true });
	}

	/* var clearSliders = function () {
		if (sliders_arr.length > 0) {
			$.each(sliders_arr, function (i, slider) {
				slider.destroy();
			});
		}

		sliders_arr.length = 0;
	} */


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


		/* Sliders
		================================================== */

		initSliders();


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
