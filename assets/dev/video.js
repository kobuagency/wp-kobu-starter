/*
 * Kobu Videos v1.0.1
 */

+function ( $ ) {
	'use strict';

	// Fullscreen functions

	var isFullScreen = function() {
	   return !(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement );
	}

	// Pause all videos with sound

	var pauseOtherVideosPlaying = function () {
		var videos = $('video');

		if (videos.length > 0) {
			var videosToPause = videos.filter(function() {
				var video = $(this)[0];
				if ( ( $(this).attr('autoplay') && video.muted ) || video.paused ) {
					return false;
				} else {
					return true;
				}
			});

			// Pause all other videos currently playing.
			for (var i = videosToPause.length - 1; i >= 0; i--) {
				videosToPause[i].pause();
			}
		}
	}

	// Pause ALL videos playing without sound

	var pauseAllVideosPlayingNoSound = function () {
		var videos = $('video');

		if (videos.length > 0) {
			for (var i = videos.length - 1; i >= 0; i--) {
				if( !videos[i].paused && videos[i].muted ) {
					videos[i].pause();
				}
			}
		}
	}

	// Pause ALL videos playing

	var pauseAllVideosPlaying = function () {
		var videos = $('video');

		if (videos.length > 0) {
			for (var i = videos.length - 1; i >= 0; i--) {
				if( !videos[i].paused ) {
					videos[i].pause();
				}
			}
		}
	}


	// Seconds to h:m:s

	var secondsTimeSpanToHMS = function(s) {
	    var h = Math.floor(s/3600); //Get whole hours
	    s -= h*3600;
	    var m = Math.floor(s/60); //Get remaining minutes
	    s -= m*60;
	    if (s>3600) {
	    	return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
	    } else {
	    	return m+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
	    }
	    
	}

	// Check video support

	var supportsVideoType = function(type) {
		var video;

		var formats = {
			ogg: 'video/ogg; codecs="theora"',
			h264: 'video/mp4; codecs="avc1.42E01E"',
			webm: 'video/webm; codecs="vp8, vorbis"',
			vp9: 'video/webm; codecs="vp9"',
			hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
		};

		if(!video) {
			video = document.createElement('video')
		}

		if (video.canPlayType) {
			return video.canPlayType(formats[type] || type);
		} else {
			return false;
		}
	}

	var supportsVideo = supportsVideoType('vp9') || supportsVideoType('h264');


	var KobuVideo = function (element, settings) {
		var _ = this;

		_.defaults = {
	    	playPause: true,
	    	stop: false,
	    	sound: true,
	    	fullscreen: true,
	    	restart: false,
	    	progress: false,
	    	subtitles: false,
	    	svgbutton: '<svg width="43" height="48" viewBox="0 0 43 48" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M168 1419L168 1463 208 1441.00105z" transform="translate(-167 -1417)" fill="#F3E0E0" stroke="#F3E0E0" stroke-width="2" fill-rule="evenodd"/></svg>',
			hidecontrols: true,
			hasControls: null,
	    }

	    // Merge defaults and options, without modifying defaults
		_.options = $.extend( {}, _.defaults, settings );

		_.initials = {
			$videoWrapper: $(element),
	    	$videoElem: null,
	    	$video: null,
	    	$play: null,
	    	$playPause: null,
	    	$stop: null,
	    	$progress: null,
	    	$sound: null,
	    	$fullscreen: null,
	    	$restart: null,
	    	videoPlayed: false,
	    	canPlay: false,
	    	playWhenLoaded: false,
        };

        $.extend(_, _.initials);

        _.listenerFunctions = {
	    	pauseListener: function() {
				_.$videoWrapper.addClass('paused');
				_.$playPause.text(_theme_config.strings.play_video).removeClass('pause').addClass('play');
	    	},
	    	playListener: function() {
	    		_.$videoWrapper.removeClass('loading');
				_.$videoWrapper.removeClass('paused');
				_.$playPause.text(_theme_config.strings.pause_video).removeClass('play').addClass('pause');

				_.videoPlayed = true;
			},
			timeupdateListener: function() {
				var $progressBar = _.$progress.find('.progress-bar .progress'),
					$currentTime = _.$progress.find('.current-time'),
					currentTime = _.$video.currentTime;

				$progressBar.attr('data-current', currentTime);
				$currentTime.text(secondsTimeSpanToHMS(Math.round(currentTime)));
				$progressBar.css('width', ((currentTime / _.$video.duration) * 100) + '%');
			},
			fullscreenListeners: {
				fullscreenchange: function() {
					if (!(document.fullScreen || document.fullscreenElement)) {
						_.exitFullscreen();
					}
				},
				webkitfullscreenchange: function() {
					if(!document.webkitIsFullScreen) {
						_.exitFullscreen();
					}
				},
				mozfullscreenchange: function() {
					if(!document.mozFullScreen) {
						_.exitFullscreen();
					}
				},
				msfullscreenchange: function() {
					if(!document.msFullscreenElement) {
						_.exitFullscreen();
					}
				}
			}
	    }

	    _.init();
	}

	KobuVideo.prototype.init = function() {
        var _ = this;

        if (!$(_.$videoWrapper).hasClass('video-initialized')) {
            $(_.$videoWrapper).addClass('video-initialized');

	        _.$videoElem = _.$videoWrapper.find('video');
	        _.$video = _.$videoElem.get(0);

            if (!Modernizr.objectfit || window.navigator.userAgent.indexOf("Edge") > -1 ) {
            	_.$videoElem.addClass('no-objectfit');
				/*_.$videoElem.css({
					'position': 'absolute',
					'top': '50%',
					'left': '50%',
					'transform': 'translate(-50%, -50%)',
					'height': 'auto',
					'width': '100%'
				});*/
			}

            if (supportsVideo) {
            	if ($(_.$videoWrapper).find('track').length > 0) {
            		_.options.subtitles = true;
            	}

            	_.buildVideoElements();
	            _.initializeEvents();
            }
        }
    };

    KobuVideo.prototype.buildVideoElements = function() {
        var _ = this,
        	controls = '',
        	fullScreenEnabled;

        fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

        if (!_.$videoWrapper.hasClass('video-wrapper')) {
        	_.$videoElem.wrap('<div class="video-wrapper"></div>');
        	_.$videoWrapper = _.$videoWrapper.find('.video-wrapper');
        	_.$videoWrapper.addClass('loading paused');
        } else {
        	_.$videoWrapper.addClass('loading paused');
        }

		var hasControls;
		
		if ( _.options.hasControls === null ) {
			hasControls = _.$videoElem.attr('controls');
		} else {
			hasControls = _.options.hasControls;
		}

        _.$videoElem.removeAttr('controls');
        _.$videoElem.removeAttr('preload');
        _.$videoElem.removeAttr('height');
        _.$videoElem.removeAttr('width');
        _.$videoElem.attr('playsinline',true);

        controls += '<button type="button" class="play-video-btn" aria-label="'+_theme_config.strings.play_video+'">'+_.options.svgbutton+'</button>';

        if (hasControls) {
        	controls += '<div class="video-controls">';
				controls += '<div class="video-controls-wrapper">';
					if (_.options.playPause) {
						controls += '<button type="button" class="play-pause play">'+_theme_config.strings.play_video+'</button>';
					}
					if (_.options.stop) {
						controls += '<button type="button" class="stop">'+_theme_config.strings.stop_video+'</button>';
					}
					if (_.options.progress) {
						controls += '<div class="progress-bar-wrapper"><div class="current-time" aria-label="'+_theme_config.strings.current_time+'">0:00</div><div class="progress-bar"><div class="bar"></div><div class="progress"></div></div></div>';
					}
					if (_.options.sound) {
						if (_.$video.muted) {
							controls += '<button type="button" class="mute muted">'+_theme_config.strings.unmute+'</button>';
						} else {
							controls += '<button type="button" class="mute">'+_theme_config.strings.mute+'</button>';
						}
					}
					if (_.options.restart) {
						controls += '<button type="button" class="restart">'+_theme_config.strings.restart+'</button>';
					}
					if (_.options.fullscreen && fullScreenEnabled) {
						controls += '<button type="button" class="fullscreen">'+_theme_config.strings.fullscreen+'</button>';
					}
				controls += '</div>';
			controls += '</div>';
        }

		_.$videoWrapper.append(controls);

		_.$play = _.$videoWrapper.find('.play-video-btn');

		if (_.options.playPause) {
			_.$playPause = _.$videoWrapper.find('.video-controls .play-pause');
		}
		if (_.options.stop) {
			_.$stop = _.$videoWrapper.find('.video-controls .stop');
		}
		if (_.options.progress) {
			_.$progress = _.$videoWrapper.find('.video-controls .progress-bar-wrapper');
		}
		if (_.options.sound) {
			_.$sound = _.$videoWrapper.find('.video-controls .mute');
		}
		if (_.options.fullscreen && fullScreenEnabled) {
			_.$fullscreen = _.$videoWrapper.find('.video-controls .fullscreen');
		}
		if (_.options.restart) {
			_.$restart = _.$videoWrapper.find('.video-controls .restart');
		}
    };

    KobuVideo.prototype.initializeEvents = function() {
        var _ = this;

        // Video events

        _.$video.addEventListener('pause', _.listenerFunctions.pauseListener, false);
		_.$video.addEventListener('play', _.listenerFunctions.playListener, false);

		if (_.options.progress) {
			_.$video.addEventListener('timeupdate', _.listenerFunctions.timeupdateListener, false);
		}

		// Check if video is ready to play

		var removeLoading = function() {
			_.$videoWrapper.removeClass('loading');
			_.canPlay = true;

			if (_.playWhenLoaded || _.$videoElem.attr('autoplay')) {
				if ( _.$videoElem.is(":in-viewport") ) {
					_.playVideo('no-focus');

					if ( !_.$videoWrapper.hasClass('paused') ) {
						_.$playPause.text(_theme_config.strings.pause_video).removeClass('play').addClass('pause');
					}
				}
			}
		}

		if (_.$video.readyState >= 2) {
			removeLoading();
		} else {
			_.$video.addEventListener('loadeddata', function loadedVideoData() {
				removeLoading();
				_.$video.removeEventListener('loadeddata', loadedVideoData);
			});
			_.$video.load();
		}

		if (_.options.subtitles) {
			var tracks = _.$video.textTracks;

			if (tracks.length) {
				var track = tracks[0];

				if (track) {
					track.mode = 'hidden';

					if (!_.$videoWrapper.find('.subtitles').length) {
						_.$videoWrapper.append('<div class="subtitles" aria-hidden="true"></div>');
					}
					
					var subtitles_container = _.$videoWrapper.find('.subtitles');
					
					$(track).on('cuechange', function() {
						var activeCue = track.activeCues[0];

						if (activeCue) {
							if (activeCue.text !== '') {
								subtitles_container.html('<span>' + activeCue.text + '</span>').addClass('visible');
							}

							$(activeCue).on('exit', function() {
								subtitles_container.removeClass('visible');
								$(activeCue).off('exit');
							});
						}
					});
				}
			} else {
				_.options.subtitles = false;
			}
		}

		// Click events

		if (_.options.hidecontrols) {
			if ($('body').hasClass('mobile')) {
				_.$videoElem.on('click touchend', function(e) {
					_.$videoWrapper.toggleClass('show-controls');

					if (e.cancelable) {
						e.preventDefault();
						e.stopPropagation();
					}
				});
			} else {
				_.$videoWrapper.on('mouseenter', function() {
					_.$videoWrapper.addClass('show-controls');
				});
				_.$videoWrapper.on('mouseleave', function() {
					_.$videoWrapper.removeClass('show-controls');
				});
			}
		}

		if (_.$play) {
			_.$play.on('click', function() {
				_.$videoElem.removeClass('no-autoplay');
				_.playVideo();

				if ($('body').hasClass('mobile') && _.options.hidecontrols) {
					_.$videoWrapper.removeClass('show-controls');
				}
			});
		}

		if (_.$playPause) {
			_.$playPause.on('click', function() {
				_.playPauseVideo();
			});
		}

        if (_.$stop) {
	        _.$stop.on('click', function() {
				_.$video.pause();
				_.$videoWrapper.addClass('paused');
				_.$video.currentTime = 0;
			});
		}

        if (_.$progress) {
        	var $progressBar = _.$progress.find('.progress-bar');

	        $progressBar.on('click', function(event) {
	        	var bar_start = $progressBar.offset().left;
				var bar_end = bar_start + $progressBar.width();
				var pos = (event.pageX - bar_start) / (bar_end - bar_start);

				var currentTime = pos * _.$video.duration;
				_.$video.currentTime = currentTime;
				_.$progress.find('.progress').css('width', ((currentTime / _.$video.duration) * 100) + '%');
			});
		}

        if (_.$restart) {
	        _.$restart.on('click', function() {
				_.$video.currentTime = 0;
				_.$videoWrapper.removeClass('paused');
				_.$video.play();
			});
	    }

        if (_.$sound) {
	        _.$sound.on('click', function() {
				if (_.$video.muted) {
					_.$video.muted = false;
					_.$sound.text(_theme_config.strings.mute).removeClass('muted');
				} else {
					_.$video.muted = true;
					_.$sound.text(_theme_config.strings.unmute).addClass('muted');
				}
			});
	    }

        if (_.$fullscreen) {
	        _.$fullscreen.on('click', function() {
				_.handleFullscreen();
			});
	    }

	    // Fullscreen event listeners

        document.addEventListener('fullscreenchange', _.listenerFunctions.fullscreenListeners.fullscreenchange);
		document.addEventListener('webkitfullscreenchange', _.listenerFunctions.fullscreenListeners.webkitfullscreenchange);
		document.addEventListener('mozfullscreenchange', _.listenerFunctions.fullscreenListeners.mozfullscreenchange);
		document.addEventListener('msfullscreenchange', _.listenerFunctions.fullscreenListeners.msfullscreenchange);
    };

    KobuVideo.prototype.playPauseVideo = function() {
        var _ = this;

        if ( _.$video.paused ) {
			_.$videoElem.removeClass('no-autoplay');
			_.playVideo();
		} else {
			_.$videoElem.addClass('no-autoplay');
			_.pauseVideo();
		}
    };

    KobuVideo.prototype.restartVideo = function() {
        var _ = this;

        if (_.canPlay) {
        	pauseOtherVideosPlaying();

			_.$video.currentTime = 0;
			var promise = _.$video.play();

			if (promise !== undefined) {
			    promise.then( function() {
			        if (!_.$video.paused) {
						_.$videoWrapper.removeClass('paused');
						_.$playPause.text(_theme_config.strings.pause_video);
					}
			    }).catch( function() {});
			}

			setTimeout(function() {
				if (_.$playPause) {
					_.$playPause.focus();
				}
	        }, 300);
        } else {
        	_.playWhenLoaded = true;
        }
    };

    KobuVideo.prototype.playVideo = function(focus) {
		var _ = this;
		focus = focus || 'focus';

        if (_.canPlay) {
        	pauseOtherVideosPlaying();

			_.$video.play();

			if (!_.$video.paused) {
				_.$videoWrapper.removeClass('paused');
				_.$playPause.text(_theme_config.strings.pause_video);
			} else {
				_.$videoElem.addClass('no-autoplay');
			}

			if ( focus == 'focus' ) {
				setTimeout(function() {
					if (_.$playPause) {
						_.$playPause.focus();
					}
				}, 300);
			}
        } else {
        	_.playWhenLoaded = true;
        }
    };

    KobuVideo.prototype.pauseVideo = function() {
        var _ = this;

        _.$video.pause();
		_.$videoWrapper.addClass('paused');
		_.$playPause.text(_theme_config.strings.play_video);

		setTimeout(function() {
			if (_.$playPause) {
				_.$playPause.focus();
			}
        }, 300);
    };

    KobuVideo.prototype.exitFullscreen = function() {
		var _ = this;

		if (_.$sound) {
			if (_.$video.muted) {
				_.$sound.text(_theme_config.strings.mute).addClass('muted');
			} else {
				_.$sound.text(_theme_config.strings.unmute).removeClass('muted');
			}
		}

		_.$videoWrapper.removeClass('fullscreen');
	}

	KobuVideo.prototype.handleFullscreen = function() {
        var _ = this;

        if (isFullScreen()) {
	      if (document.exitFullscreen) {document.exitFullscreen();}
	      else if (document.mozCancelFullScreen) {document.mozCancelFullScreen();}
	      else if (document.webkitCancelFullScreen) {document.webkitCancelFullScreen();}
	      else if (document.msExitFullscreen) {document.msExitFullscreen();}
	   }
	   else {
	      if (_.$video.requestFullscreen) {_.$video.requestFullscreen();}
	      else if (_.$video.mozRequestFullScreen) {_.$video.mozRequestFullScreen();}
	      else if (_.$video.webkitRequestFullScreen) {_.$video.webkitRequestFullScreen();}
	      else if (_.$video.msRequestFullscreen) {_.$video.msRequestFullscreen();}

	      _.$videoWrapper.addClass('fullscreen');
	   }
    };

    KobuVideo.prototype.clearEvents = function() {
    	var _ = this;

    	_.$video.removeEventListener('pause', _.listenerFunctions.pauseListener, false);
		_.$video.removeEventListener('play', _.listenerFunctions.playListener, false);

		if (_.options.subtitles) {
			$(_.$video.textTracks[0]).off('cuechange');
		}

		if (_.options.progress) {
			_.$video.removeEventListener('timeupdate', _.listenerFunctions.timeupdateListener, false);
		}

		if (_.options.hidecontrols) {
			if ($('body').hasClass('mobile')) {
				_.$videoElem.off('click touchend');
			} else {
				_.$videoWrapper.off('mouseenter');
				_.$videoWrapper.off('mouseleave');
			}
		}

		if (_.$play) {
			_.$play.off('click');
		}

		if (_.$playPause) {
			_.$playPause.off('click');
		}

        if (_.$stop) {
	        _.$stop.off('click');
		}

		if (_.$progress) {
        	var $progressBar = _.$progress.find('.progress-bar');
	        $progressBar.off('click');
	    }

        if (_.$restart) {
	        _.$restart.off('click');
	    }

        if (_.$sound) {
	        _.$sound.off('click');
	    }

        if (_.$fullscreen) {
	        _.$fullscreen.off('click');
	    }

		// Fullscreen event listeners

        document.removeEventListener('fullscreenchange', _.listenerFunctions.fullscreenListeners.fullscreenchange);
		document.removeEventListener('webkitfullscreenchange', _.listenerFunctions.fullscreenListeners.webkitfullscreenchange);
		document.removeEventListener('mozfullscreenchange', _.listenerFunctions.fullscreenListeners.mozfullscreenchange);
		document.removeEventListener('msfullscreenchange', _.listenerFunctions.fullscreenListeners.msfullscreenchange);
    };

	$.fn.kobuvideo = function() {
        var _ = this,
            options = arguments[0],
            l = _.length,
            i,
            method;

        for (i = 0; i < l; i++) {
        	// If object options or empty, initialize new video
            if (typeof options == 'object' || typeof options == 'undefined') {
	            _[i].kobuvideo = new KobuVideo(_[i], options);
	        } else if (supportsVideo) {
	        	// Check if exists and run object method
	            method = _[i].kobuvideo[options].apply(_[i].kobuvideo);

	            if (typeof method != 'undefined') {
	            	return method;
	            }
	        }
        }

        return _;
	};

	var playVideosInViewport = function() {
		$('video').each(function(){
			var video = $(this)[0];
			
			if ( $(this).is(":in-viewport") ) {
				if( !$(this).hasClass('no-autoplay') && $(this).attr('autoplay') && video.paused ) {
					video.play();
				}
			} else if( !video.paused && video.muted ) {
				video.pause();
			}
		});
	}
	
	$(document).ready(function () {
		$(window).on('scroll', function() {
			playVideosInViewport();
		});
	
		// Play/pause videos when the window is minimized or the tab is changed on browser.
		window.addEventListener( 'focus', playVideosInViewport );
		window.addEventListener( 'blur', pauseAllVideosPlayingNoSound );

		var pausedTime = 0,
			isPaused = false,
			timerIncrement;
			
		//Increment the paused time counter every minute.
		var pausedInterval = setInterval(timerIncrement, 60000); // 1 minute

		timerIncrement = function() {
			pausedTime++;
			
			if (pausedTime > 20) { // 20 minutes
				pauseAllVideosPlaying();
				
				isPaused = true;
				pausedTime = 0;
				clearInterval(pausedInterval);
			}
		}
			
		//Zero the paused timer on user interaction.
		$(window).on('mousemove scroll keypress focus', function() {
			pausedTime = 0;

			if (isPaused) {
				isPaused = false
				pausedInterval = setInterval(timerIncrement, 60000);
				playVideosInViewport();
			}
		});
	});

}(jQuery);