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
	wp_enqueue_script( 'mywptheme', MYWPTHEME_THEME_URL . '/assets/dist/mywptheme.min.js', $script_dependencies, MYWPTHEME_THEME_VERSION, true );

	$script_vars = apply_filters( 'mywptheme_script_vars', array(
		//e.g. 'load_nameofscript'			=> false,
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