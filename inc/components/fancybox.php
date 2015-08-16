<?php
/**
 * Fancybox loading.
 *
 * @package mywptheme
 */

function mywptheme_enqueue_fancybox_script() {
	wp_enqueue_style( 'jquery-fancybox', MYWPTHEME_THEME_URL . '/assets/third-party/fancybox/source/jquery.fancybox.css', array(), '2.1.5' );
	wp_enqueue_script( 'jquery-fancybox', MYWPTHEME_THEME_URL . '/assets/third-party/fancybox/source/jquery.fancybox.pack.js', array( 'jquery' ), '2.1.5', true );
}
add_action( 'wp_enqueue_scripts', 'mywptheme_enqueue_fancybox_script' );

function mywptheme_add_fancybox_dependency( $script_dependencies ) {
	$script_dependencies[] = 'jquery-fancybox';
	return $script_dependencies;
}
add_filter( 'mywptheme_script_dependencies', 'mywptheme_add_fancybox_dependency' );

function mywptheme_enable_fancybox( $vars ) {
	$vars['load_fancybox'] = true;
	return $vars;
}
add_filter( 'mywptheme_script_vars', 'mywptheme_enable_fancybox' );
