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
	));

	// Hide admin bar at front-end
	show_admin_bar(false);
}
add_action('after_setup_theme', 'mywptheme_setup');
