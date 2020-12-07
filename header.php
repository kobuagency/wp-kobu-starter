<?php

/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package mywptheme
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php mywptheme_wp_title('|'); ?></title>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

	<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicon.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri(); ?>/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri(); ?>/favicon-16x16.png">
	<link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/site.webmanifest">
	<link rel="mask-icon" href="<?php echo get_template_directory_uri(); ?>/safari-pinned-tab.svg" color="#bbb5ad">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="theme-color" content="#ffffff">

	<?php echo kobu_header_scripts(); ?>
	<?php wp_head(); ?>

	<style>
		<?php include_once(MYWPTHEME_THEME_PATH . '/assets/dist/mywptheme_critical.min.css'); ?>
	</style>
</head>

<?php $bodyclasses = '';
if (wp_is_mobile()) {
	$bodyclasses .=  ' mobile';
} ?>

<body <?php body_class($bodyclasses); ?>>

<?php
	$hide_cookie = (isset($_COOKIE['privacy_acceptance']) && $_COOKIE['privacy_acceptance'] == 1) ? 1 : 0;
	
	if ($hide_cookie == 0) {
		$cookies_bar = get_field('cookies_bar', 'options');

		if ($cookies_bar) {
			$cookie_text = $cookies_bar['text'];
			$button_text = $cookies_bar['button_text'];

			if ($cookie_text) { ?>
				<div id="cookies-notification">
					<div class="notification-wrapper">
						<div class="message">
							<?php echo $cookie_text; ?>
						</div>
						<div class="buttons">
							<button id="accept-cookies" class="btn whiteghost"><?php echo $button_text; ?></button>
						</div>
					</div>
				</div>
	<?php }
		}
	} ?>

	<header id="header" class="header clear">

		<div class="container">

			<div id="logo-wrapper" class="logo">
				<a href="<?php echo home_url(); ?>">
					<img src="<?php echo MYWPTHEME_THEME_URL ?>/assets/images/main-logo.svg" alt="<?php bloginfo('name'); ?>">
				</a>
			</div>

			<?php // Primary Menu 
			?>
			<?php if (has_nav_menu('primary')) : ?>
				<div id="navigation" class="navigation-wrapper">
					<nav class="navigation" role="navigation">
						<?php wp_nav_menu(array(
							'theme_location'	=> 'primary',
							'sort_column'	=> 'menu_order',
							'menu_class'	=> 'dropdown-menu menu',
							'fallback_cb'	=> false,
							'walker'		=> new Kobu_Dropdown_Walker_Nav_Menu()
						)); ?>
					</nav>
					<div class="language-wrapper">
						<?php language_selector_flags() ?>
					</div>
				</div><!-- #navigation -->

				<button class="toggle-menu"></button>

				<div class="mobile-menu">
					<div id="mobile-nav" class="navigation mobile-navigation-menu">
						<div class="navigation mobile-menu-wrapper">
							<?php wp_nav_menu(array(
								'theme_location'	=> 'primary',
								'sort_column'	=> 'menu_order',
								'menu_class'	=> 'dropdown-menu menu',
								'fallback_cb'	=> false,
								'walker'		=> new Kobu_Dropdown_Walker_Nav_Menu()
							)); ?>
						</div>
					</div>
				</div>
			<?php endif; ?>

		</div>

	</header>

	<div id="tablesite-content">
		<div id="main-content">