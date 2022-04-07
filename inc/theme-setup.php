<?php

/**
 * This file sets up the theme.
 *
 * @package mywptheme
 */

if (!isset($content_width)) {
	$content_width = 640;
}

function mywptheme_setup()
{
	load_theme_textdomain('kobu', MYWPTHEME_THEME_PATH . '/languages');

	add_theme_support('automatic-feed-links');
	add_theme_support('post-thumbnails');
	add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));

	register_nav_menus(array(
		'primary'		=> __('Main Menu', 'kobu'),
		'full'			=> __('Full Menu', 'kobu'),
		'footer'		=> __('Footer Menu', 'kobu'),
	));

	// Hide admin bar at front-end
	show_admin_bar(false);

	// Disable gradients
	add_theme_support('editor-gradient-presets', []);
	add_theme_support('disable-custom-gradients', true);

	// Remove default block patterns
	remove_theme_support('core-block-patterns');
}
add_action('after_setup_theme', 'mywptheme_setup');
