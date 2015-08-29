<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package mywptheme
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php mywptheme_wp_title( '|' ); ?></title>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicon.png" />
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<header role="banner">

		<div class="container">

			<div id="logo">
				<a href="<?php echo home_url(); ?>">
					<img src="<?php echo CPTHEME_THEME_URL?>/assets/images/main-logo.svg" />
				</a>
			</div>

			<?php // Primary Menu ?>
			<?php if( has_nav_menu( 'primary' ) ) : ?>
				<nav role="navigation">
					<?php   wp_nav_menu( array(
                                                    'theme_location'	=> 'main_menu',
                                                    'sort_column'	=> 'menu_order',
                                                    'menu_class'	=> 'dropdown-menu sf-menu',
                                                    'fallback_cb'	=> false,
                                                    'walker'		=> new Kobu_Dropdown_Walker_Nav_Menu()
                                                ) ); ?>
				</nav>
			<?php endif; ?>

		</div>

	</header>

	<div id="content">
