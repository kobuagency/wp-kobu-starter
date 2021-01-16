<?php

/**
 * Script enqueuing
 *
 * @package mywptheme
 */

//Stop loading the WPCF7 JavaScript and CSS stylesheet on all pages
add_filter('wpcf7_load_js', '__return_false');
add_filter('wpcf7_load_css', '__return_false');

function mywptheme_enqueue_script()
{
	// Critical styles
	//wp_enqueue_style('critical_css', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme_critical.min.css', array(), MYWPTHEME_THEME_VERSION);

	// Theme JS
	wp_enqueue_script('intersectionObserver', MYWPTHEME_THEME_URL . '/assets/dist/intersectionObserver.min.js', array(), MYWPTHEME_THEME_VERSION, true);

	$script_dependencies = apply_filters('mywptheme_script_dependencies', array('jquery'));
	wp_enqueue_script('mywptheme', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme_scripts.min.js', $script_dependencies, MYWPTHEME_THEME_VERSION, true);

	$script_vars = array(
		'theme_path'		=> MYWPTHEME_THEME_URL,
		'strings'			=> array(
			'pause_video'		=> __('Pause video', 'kobu'),
			'play_video'		=> __('Start video', 'kobu'),
			'stop_video'		=> __('Stop video', 'kobu'),
			'mute'				=> __('Mute', 'kobu'),
			'unmute'			=> __('Unmute', 'kobu'),
			'fullscreen'		=> __('Fullscreen', 'kobu'),
			'restart'			=> __('Restart', 'kobu'),
			'current_time'		=> __('Current time', 'kobu'),
			'previous'			=> __('Previous', 'kobu'),
			'next'				=> __('Next', 'kobu'),
			'page'				=> __('Page', 'kobu'),
		),
	);

	wp_localize_script('mywptheme', '_theme_config', $script_vars);

	// Ajax
	/* wp_localize_script( 'mywptheme', 'ajaxfilters', array(
		'ajaxurl' => admin_url( 'admin-ajax.php' )
	)); */

	if (WP_DEBUG) {
		wp_enqueue_script('livereload', untrailingslashit(home_url()) . ':35729/livereload.js?snipver=1', array(), false, true);
	}

	// Enqueue jQuery at bottom
	wp_script_add_data( 'jquery', 'group', 1 );
    wp_script_add_data( 'jquery-core', 'group', 1 );
	wp_script_add_data( 'jquery-migrate', 'group', 1 );
}
add_action('wp_enqueue_scripts', 'mywptheme_enqueue_script');


// Remove Gutenberg Block Library CSS from loading on the frontend
function mywptheme_dequeue_styles()
{
	wp_dequeue_style('wp-block-library');
	wp_dequeue_style('kobu_custom_blocks-style-css');
}
add_action('wp_print_styles', 'mywptheme_dequeue_styles', 100);

function mywptheme_dequeue_scripts()
{
	wp_dequeue_script('google-recaptcha');
	wp_dequeue_script('wpcf7-recaptcha');
}
add_action('wp_print_scripts', 'mywptheme_dequeue_scripts', 100);


function mywptheme_enqueue_third_party_scripts()
{
	// enqueue footer scripts
	wp_enqueue_script('slick', MYWPTHEME_THEME_URL . '/assets/third-party/slick-carousel/slick/slick.min.js', array('jquery'), '1.8.0', true);

	wp_enqueue_script('modernizr', MYWPTHEME_THEME_URL . '/assets/third-party/modernizr/modernizr-custom.js', array('jquery'), '3.6.0', true);
	wp_enqueue_script('isInViewport', MYWPTHEME_THEME_URL . '/assets/third-party/isInViewport/lib/isInViewport.js', array('jquery'), '3.0.4', true);

	// Vimeo and youtube player
	if (has_block('embed')) {
		wp_enqueue_script('vimeo', MYWPTHEME_THEME_URL . '/assets/third-party/vimeo/vimeo_player.min.js', array(), '2.10.0', true);
		wp_enqueue_script('youtube', 'https://www.youtube.com/iframe_api', array(), '1.0.0', true);
    }
    
    // Google maps
	//wp_enqueue_script('google_maps', 'https://maps.googleapis.com/maps/api/js?key=', array('jquery'), '', true);
}
add_action('wp_enqueue_scripts', 'mywptheme_enqueue_third_party_scripts');


function mywptheme_enqueue_footer()
{
	// Enqueue non-critical styles
	wp_enqueue_style('wp-block-library');
	wp_enqueue_style('kobu_custom_blocks-style-css');
    wp_enqueue_style('slick', MYWPTHEME_THEME_URL . '/assets/third-party/slick-carousel/slick/slick.css', array(), '1.8.0');
    
    if (has_block('shortcode')) {
		if (function_exists('wpcf7_enqueue_scripts')) {
			wpcf7_enqueue_scripts();
		}

		if (function_exists('wpcf7_enqueue_styles')) {
			wpcf7_enqueue_styles();
		}

		wp_enqueue_script('google-recaptcha');
		wp_enqueue_script('wpcf7-recaptcha');
	}

	$style_dependencies = apply_filters('mywptheme_style_dependencies', array());
	wp_enqueue_style('mywptheme', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme.min.css', $style_dependencies, MYWPTHEME_THEME_VERSION);
	wp_enqueue_style('no_script', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme_nojs.min.css', array(), MYWPTHEME_THEME_VERSION);
}
add_action('get_footer', 'mywptheme_enqueue_footer');


function mywptheme_main_script_dependency($script_dependencies)
{
	$script_dependencies[] = 'modernizr';
	$script_dependencies[] = 'isInViewport';

	if (has_block('embed')) {
		$script_dependencies[] = 'vimeo';
		$script_dependencies[] = 'youtube';
	}

	return $script_dependencies;
}
add_filter('mywptheme_script_dependencies', 'mywptheme_main_script_dependency');


// noscript style
function noscript_style_loader_tag($html, $handle, $href, $media)
{
	if ('no_script' === $handle) {
		$html = '<noscript>' . $html . '</noscript>';
	}

	return $html;
}
add_filter('style_loader_tag', 'noscript_style_loader_tag', 10, 4);
