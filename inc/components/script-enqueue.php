<?php
/**
 * Script enqueuing
 *
 * @package mywptheme
 */

function mywptheme_enqueue_nameofscript_script() {
	//e.g. wp_enqueue_style( 'jquery-fancybox', MYWPTHEME_THEME_URL . '/assets/third-party/fancybox/source/jquery.fancybox.css', array(), '2.1.5' );
	//e.g. wp_enqueue_script( 'jquery-fancybox', MYWPTHEME_THEME_URL . '/assets/third-party/fancybox/source/jquery.fancybox.pack.js', array( 'jquery' ), '2.1.5', true );
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
