<?php

/**
 * Gutenberg related
 *
 * @package mywptheme
 */


/**
 * Registers support for Gutenberg wide images in Writy.
 */
if (!function_exists('writy_setup')) {
    function writy_setup()
    {
        add_theme_support('align-wide');
    }
    add_action('after_setup_theme', 'writy_setup');
}

/**
 * Add custom colors to blocks
 */
add_theme_support('editor-color-palette', array(
    array(
        'name'  => __('Black', 'kobu'),
        'slug'  => 'black',
        'color' => '#000000',
    ),
    array(
        'name'  => __('White', 'kobu'),
        'slug'  => 'white',
        'color' => '#ffffff',
    ),
));

/**
 * Add custom font-sizes to blocks
 */
add_theme_support('editor-font-sizes', array(
    array(
        'name'      => __('Small', 'kobu'),
        'size'      => 14,
        'slug'      => 'small'
    ),
    array(
        'name'      => __('Regular', 'kobu'),
        'size'      => 16,
        'slug'      => 'regular'
    ),
    array(
        'name'      => __('Medium', 'kobu'),
        'size'      => 18,
        'slug'      => 'medium'
    ),
    array(
        'name'      => __('Large', 'kobu'),
        'size'      => 32,
        'slug'      => 'large'
    )
));

/**
 * Gutenberg admin styles and scripts
 */
function kobu_custom_format_script_register()
{
    wp_register_script(
        'kobu-editor-scripts',
        MYWPTHEME_THEME_URL . '/inc/gutenberg-files/editor-scripts.js',
        array(
            'wp-element',
            'wp-rich-text',
            'wp-format-library',
            'wp-i18n',
            'wp-editor',
            'wp-compose',
            'wp-components',
            'wp-blocks',
            'wp-dom-ready',
            'wp-edit-post'
        )
    );
}
add_action('init', 'kobu_custom_format_script_register');


function kobu_block_editor_assets()
{
    if (is_admin()) {
        wp_enqueue_style('kobu-editor-styles', MYWPTHEME_THEME_URL . "/inc/gutenberg-files/gutenberg-editor.min.css", array(), '1.0');
        wp_enqueue_script('kobu-editor-scripts');
    }
}
add_action('enqueue_block_editor_assets', 'kobu_block_editor_assets');

/**
 * Add new blocks category
 */
if (!function_exists('kobu_custom_blocks_category')) {
    function kobu_custom_blocks_category($categories, $post)
    {
        return array_merge(
            $categories,
            array(
                array(
                    'slug' => 'kobu-custom-blocks',
                    'title' => __('Custom blocks', 'kobu'),
                ),
            )
        );
    }

    add_filter('block_categories', 'kobu_custom_blocks_category', 10, 2);
}