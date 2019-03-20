<?php
/**
 * Script enqueuing
 *
 * @package mywptheme
 */

function mywptheme_enqueue_nameofscript_script() {
	wp_enqueue_style( 'slick', MYWPTHEME_THEME_URL . '/assets/third-party/slick-carousel/slick/slick.css', array(), '1.8.0' );
	wp_enqueue_script( 'slick', MYWPTHEME_THEME_URL . '/assets/third-party/slick-carousel/slick/slick.min.js', array( 'jquery' ), '1.8.0', true );

	wp_enqueue_script( 'imagesloaded', MYWPTHEME_THEME_URL . '/assets/third-party/imagesloaded/imagesloaded.pkgd.min.js', array( 'jquery' ), '4.1.4', true );

	/*wp_enqueue_script( 'ajax_filters', MYWPTHEME_THEME_URL . '/assets/dist/ajax_filters.min.js', array( 'jquery' ), '1.0.0', true );
	
	wp_localize_script( 'ajax_filters', 'ajaxfilters', array(
		'ajaxurl' => admin_url( 'admin-ajax.php' )
	));*/
}
add_action( 'wp_enqueue_scripts', 'mywptheme_enqueue_nameofscript_script' );

function mywptheme_add_nameofscript_dependency( $script_dependencies ) {
	//e.g. $script_dependencies[] = 'jquery-nameofscript';
	return $script_dependencies;
}
add_filter( 'mywptheme_script_dependencies', 'mywptheme_add_nameofscript_dependency' );

function mywptheme_enable_nameofscript( $vars ) {
	// $vars['load_nameofscript'] = true;
	return $vars;
}
add_filter( 'mywptheme_script_vars', 'mywptheme_enable_nameofscript' );
