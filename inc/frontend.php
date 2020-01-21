<?php
/**
 * This file contains important frontend functionality.
 *
 * @package mywptheme
 */

function mywptheme_enqueue_scripts() {
	$style_dependencies = apply_filters( 'mywptheme_style_dependencies', array() );
	$script_dependencies = apply_filters( 'mywptheme_script_dependencies', array( 'jquery' ) );

	wp_enqueue_style( 'mywptheme', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme.min.css', $style_dependencies, MYWPTHEME_THEME_VERSION );
	wp_enqueue_script( 'mywptheme', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme_scripts.min.js', $script_dependencies, MYWPTHEME_THEME_VERSION, true );

	$script_vars = apply_filters( 'mywptheme_script_vars', array(
        'theme_path'		=> MYWPTHEME_THEME_URL,
        'strings'			=> array(
                                'pause_video'		=> __( 'Pause video', 'kobu' ),
                                'play_video'		=> __( 'Start video', 'kobu' ),
                                'stop_video'		=> __( 'Stop video', 'kobu' ),
                                'mute'				=> __( 'Mute', 'kobu' ),
                                'unmute'			=> __( 'Unmute', 'kobu' ),
                                'fullscreen'		=> __( 'Fullscreen', 'kobu' ),
                                'restart'			=> __( 'Restart', 'kobu' ),
                                'current_time'		=> __( 'Current time', 'kobu' ),
                            ),
	) );

	wp_localize_script( 'mywptheme', '_theme_config', $script_vars );

	if ( WP_DEBUG ) {
		wp_enqueue_script( 'livereload', untrailingslashit( home_url() ) . ':35729/livereload.js?snipver=1', array(), false, true );
	}
}
add_action( 'wp_enqueue_scripts', 'mywptheme_enqueue_scripts' );

function mywptheme_wp_title( $sep ) {
	if ( defined( 'WPSEO_VERSION' ) ) {
		wp_title( '' );
	} else {
		wp_title( $sep, true, 'right' );
		if ( ! is_feed() ) {
			global $page, $paged;

			bloginfo( 'name', 'display' );

			$site_description = get_bloginfo( 'description', 'display' );
			if ( $site_description && ( is_home() || is_front_page() ) ) {
				echo ' ' . $sep . ' ' . $site_description;
			}

			if ( ( $paged >= 2 || $page >= 2 ) && ! is_404() ) {
				echo ' ' . $sep . ' ' . sprintf( __( 'Page %s', 'mywptheme' ), max( $paged, $page ) );
			}
		}
	}
}

/* WPML Language Switcher */
function language_selector_flags(){
    if (function_exists('icl_get_languages')) {
		
		$langs = '';
		$languages = icl_get_languages('skip_missing=0');
		$languages['pt-pt']['language_code'] = 'pt';

		echo '<div class="lang-selector-group">';

		echo '<div class="current-lang">';
			echo '<div class="current-lang-code">';
			if (ICL_LANGUAGE_CODE == 'pt-pt') {
				echo "pt";
			} else {
				echo ICL_LANGUAGE_CODE;
			}
			echo '</div>';
			echo '<span class="arrow-down arrow-blue"></span>';
		echo '</div>';
		
		echo '<div class="lang-selector">';
		if(!empty($languages)){
			foreach ($languages as $l) { 
			    if ($l['active']) {
			    	$class = ' class="active"';
			    } else {
			    	$class = NULL;
			    }
	           	$langs .=  '<a ' . $class . ' href="'.$l['url'].'">' . strtoupper ($l['language_code']). '</a>   ';   
		    }
			echo $langs;	    
		}
		echo '</div>';
		echo '</div>';
	        
    }
}

/**
 * Print CTA clone link
 *
 */

function kobu_print_cta($cta, $classes = 'btn') {
	if ($cta && isset($cta['text']) && $cta['text'] && isset($cta['link']) && $cta['link']) {
		if (isset($cta['target_blank']) && $cta['target_blank']) {
		 	$target = 'target="_blank"';
		} else {
			$target = '';
		}

		echo '<a href="' . $cta['link'] . '" class="' . ($classes ? $classes : 'btn') . '" ' . $target . '>' . $cta['text'] . '</a>';
	}
}

/**
 * Print Media clone
 *
 */

function kobu_print_media_elem($media, $loadvideo = false, $echo = true, $imgsize = 'full', $blockAutoplay = false) {
	$output = '';

	if ($media && $media['media']) {
		if ($media['media_type'] == 'img') {
			if ( $imgsize == 'full' ) {
				$image = $media['media']['url'];
			} else {
				$image = $media['media']['sizes'][$imgsize];
			}

			$output .= '<figure class="media-wrapper img" style="background-image: url(' . $image . ');"><div class="img-wrapper"><img src="' . $image . '" alt="' . $media['media']['alt'] . '"></div></figure>';
		} elseif ($media['media_type'] == 'video') {
			if (wp_is_mobile() && $media['video_img_mobile']) {
				if ( $imgsize == 'full' ) {
					$video_img_mobile_url = $media['video_img_mobile']['url'];
				} else {
					$video_img_mobile_url = $media['video_img_mobile']['sizes'][$imgsize];
				}

				$output .= '<figure class="media-wrapper img" style="background-image: url(' . $video_img_mobile_url . ');"><div class="img-wrapper"><img src="' . $video_img_mobile_url . '" alt="' . $media['video_img_mobile']['alt'] . '"></div></figure>';
			} else {
				$videoPlaceholder = '';
				$autoplay = $blockAutoplay ? false : $media['video_autoplay'];

				if ($media['placeholder']) {
					if ( $imgsize == 'full' ) {
						$placeholder = $media['placeholder']['url'];
					} else {
						$placeholder = $media['placeholder']['sizes'][$imgsize];
					}

					$videoPlaceholder .= '<div class="video-placeholder" style="background-image: url(' . $placeholder . ')">';
						$videoPlaceholder .= '<img src="' . $placeholder . '" alt="' . $media['placeholder']['alt'] . '">';
					$videoPlaceholder .= '</div>';
				}
				
				$videoOutput = '<video playsinline ' . ($autoplay ? ' autoplay' : '') . ($media['video_muted'] ? ' muted' : '') . ($media['video_loop'] ? ' loop' : '') . ($media['video_controls'] ? ' controls' : '') . '>';
					$videoOutput .= '<source src="' . $media['media']['url'] . '" type="video/' . $media['video_format'] . '" />';
					if ($media['video_format'] == 'webm' && $media['media_mp4']) {
						$videoOutput .= '<source src="' . $media['media_mp4']['url'] . '" type="video/mp4" />';
					}
				$videoOutput .= '</video>';

				if ($loadvideo) {
					$output .= '<figure class="kb-video media-wrapper video-loaded">';
						$output .= '<div class="video-wrapper">';
							$output .= $videoPlaceholder;
							$output .= $videoOutput;
						$output .= '</div>';
					$output .= '</figure>';
				} else {
					$videoSettings = [
						'webm' => $media['video_format'] == 'webm' ? $media['media']['url'] : '',
						'mp4' => $media['video_format'] == 'webm' && $media['media_mp4'] ? $media['media_mp4']['url'] : ($media['video_format'] == 'mp4' ? $media['media']['url'] : ''),
						'ogg' => '',
						'track' => '',
						'trackKind' => '',
						'trackSrclang' => '',
						'autoplay' => $autoplay,
						'loop' => $media['video_loop'],
						'muted' => $media['video_muted'],
						'controls' => $media['video_controls'],
						'preload' => 'metadata',
					];

					$output .= '<figure class="kb-video media-wrapper pageload-video" data-settings="' . htmlspecialchars(json_encode($videoSettings)) . '">';
						$output .= $videoPlaceholder;
						$output .= '<noscript>';
							$output .= $videoOutput;
						$output .= '</noscript>';
					$output .= '</figure>';
				}
			}
		}
	}

	if ($echo) {
		echo $output;
	} else {
		return $output;
	}
}