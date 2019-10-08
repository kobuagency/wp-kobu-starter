<?php
/**
 * Gutenberg related
 *
 * @package mywptheme
 */


/**
 * Registers support for Gutenberg wide images in Writy.
 */
if ( ! function_exists( 'writy_setup' ) ) {
    function writy_setup() {
        add_theme_support( 'align-wide' );
    }
    add_action( 'after_setup_theme', 'writy_setup' );
}


/* Add custom colors to blocks */

add_theme_support( 'editor-color-palette', array(
    array(
        'name'  => __( 'Dark blue', 'kobu' ),
        'slug'  => 'darkblue',
        'color' => '#0A2A3F',
    ),
) );

// Gutenberg styles

function kobu_custom_format_script_register() {
    wp_register_script(
        'kobu-custom-format',
        MYWPTHEME_THEME_URL . '/inc/gutenberg-files/kobu-custom-format.js',
        array(
			'wp-element',
			'wp-rich-text',
			'wp-format-library',
			'wp-i18n',
			'wp-editor',
			'wp-compose',
			'wp-components',
		)
    );
}
add_action( 'init', 'kobu_custom_format_script_register' );


function kobu_block_editor_assets() {
	if (is_admin()) {
		wp_enqueue_style( 'kobu-editor-style', MYWPTHEME_THEME_URL . "/inc/gutenberg-files/gutenberg-editor.css", array(), '1.0' );
		wp_enqueue_script( 'kobu-custom-format' );
	}
}
add_action('enqueue_block_editor_assets', 'kobu_block_editor_assets');