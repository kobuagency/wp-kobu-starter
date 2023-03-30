<?php

/**
 * Script enqueuing
 *
 * @package mywptheme
 */

/**
 * Critical CSS
 */

function critical_css()
{
	// Inline critical CSS
	$template = '';

	if (is_front_page()) {
		$template = 'homepage';
	} else {
		$template = 'default_page';
	}

	// If not cached, load inline CSS and update cookie
	if ($template && !(isset($_COOKIE['csscache']) && $_COOKIE['csscache'] == MYWPTHEME_THEME_VERSION)) {
		if (file_exists(MYWPTHEME_THEME_PATH . '/assets/dist/critical/mywptheme_critical_' . $template . '.min.css')) {
			echo '<style id="critical-css">';
			echo file_get_contents(MYWPTHEME_THEME_PATH . '/assets/dist/critical/mywptheme_critical_' . $template . '.min.css');
			echo '</style>';
		}

		setcookie('csscache', MYWPTHEME_THEME_VERSION, time() + (60 * 60 * 24 * 365), COOKIEPATH, COOKIE_DOMAIN);
	}
}
add_action('wp_head', 'critical_css');


/**
 * Enqueue scripts
 */

function mywptheme_enqueue_script()
{
	// Theme CSS -> If cached, media="all" else media="print"
	if (!(isset($_COOKIE['csscache']) && $_COOKIE['csscache'] == MYWPTHEME_THEME_VERSION)) {
		wp_enqueue_style('mywptheme-preload', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme.min.css', array(), MYWPTHEME_THEME_VERSION);
		wp_enqueue_style('mywptheme-onload', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme.min.css', array(), MYWPTHEME_THEME_VERSION, 'print');
	} else {
		wp_enqueue_style('mywptheme', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme.min.css', array('kobu_custom_blocks-style-css'), MYWPTHEME_THEME_VERSION);
	}

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
	wp_script_add_data('jquery', 'group', 1);
	wp_script_add_data('jquery-core', 'group', 1);
	wp_script_add_data('jquery-migrate', 'group', 1);
}
add_action('wp_enqueue_scripts', 'mywptheme_enqueue_script');


// Remove Gutenberg Block Library CSS from loading on the frontend
function mywptheme_dequeue_styles()
{
	wp_dequeue_style('wp-block-library');
	wp_dequeue_style('kobu_custom_blocks-style-css');
}
add_action('wp_print_styles', 'mywptheme_dequeue_styles', 100);


function mywptheme_enqueue_third_party_scripts()
{
	// enqueue footer scripts
	wp_enqueue_script('keen-slider', MYWPTHEME_THEME_URL . '/assets/third-party/keen-slider/keen-slider.min.js', array('jquery'), '6.0.0', true);

	wp_enqueue_script('modernizr', MYWPTHEME_THEME_URL . '/assets/third-party/modernizr/modernizr-custom.js', array('jquery'), '3.6.0', true);
	wp_enqueue_script('isInViewport', MYWPTHEME_THEME_URL . '/assets/third-party/isInViewport/lib/isInViewport.js', array('jquery'), '3.0.4', true);

	// imagesloaded
	wp_enqueue_script('imagesloaded');

	// Google maps
	//wp_enqueue_script('google_maps', 'https://maps.googleapis.com/maps/api/js?key=', array('jquery'), '', true);
}
add_action('wp_enqueue_scripts', 'mywptheme_enqueue_third_party_scripts');


function mywptheme_enqueue_footer()
{
	// Enqueue non-critical styles
	wp_enqueue_style('wp-block-library');
	wp_enqueue_style('kobu_custom_blocks-style-css');
	wp_enqueue_style('keen-slider', MYWPTHEME_THEME_URL . '/assets/third-party/keen-slider/keen-slider.min.css', array(), '6.0.0');
	wp_enqueue_style('no_script', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme_nojs.min.css', array(), MYWPTHEME_THEME_VERSION);
}
add_action('get_footer', 'mywptheme_enqueue_footer');


function mywptheme_main_script_dependency($script_dependencies)
{
	$script_dependencies[] = 'modernizr';
	$script_dependencies[] = 'isInViewport';
	$script_dependencies[] = 'intersectionObserver';
	$script_dependencies[] = 'imagesloaded';
	$script_dependencies[] = 'keen-slider';

	return $script_dependencies;
}
add_filter('mywptheme_script_dependencies', 'mywptheme_main_script_dependency');


// Noscript and preload styles
function style_loader_tag_filter($html, $handle, $href, $media)
{
	if ('no_script' === $handle) {
		$html = '<noscript>' . $html . '</noscript>';
	}
	if ('mywptheme-preload' === $handle) {
		$html = str_replace("rel='stylesheet'", "rel='preload' as='style' ", $html);
	}
	if ('mywptheme-onload' === $handle) {
		$html = str_replace("media='print'", "media='print' onload='this.media=\"all\"'", $html);
	}

	return $html;
}
add_filter('style_loader_tag', 'style_loader_tag_filter', 10, 4);
