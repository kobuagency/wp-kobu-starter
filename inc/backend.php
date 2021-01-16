<?php

/**
 * This file contains important backend functionality.
 *
 * @package mywptheme
 */

/**
 * Change the Login Admin Screen
 */
function kobu_login_logo()
{ ?>
    <style type="text/css">
        * {
            box-sizing: border-box;
        }

        body.login {
            background-color: #FAFAFA;
            display: table;
            height: 100%;
            width: 100%;
        }

        body.login div#login {
            display: table-cell;
            vertical-align: middle;
            padding: 30px 0 30px 0;
            width: 100%;
        }

        body.login div#login>p,
        #login_error,
        .login .message {
            width: 380px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            box-shadow: none !important;
        }

        body.login div#login h1 a {
            background-image: url('<?php echo MYWPTHEME_THEME_URL; ?>/assets/images/main-logo.svg');
            background-size: 100%;
            height: 50px;
            width: 280px;
            margin: 0 auto 30px auto;
            display: inline-block;
        }

        body.login div#login form {
            padding: 0;
            background: transparent;
            -webkit-box-shadow: none;
            box-shadow: none;
            border: 0px solid transparent;
            border-radius: 0;
            width: 380px;
            margin: 40px auto 40px auto;
        }

        body.login div#login form#loginform label,
        body.login div#login form#lostpasswordform label {
            font-size: 12px;
        }

        body.login div#login form#loginform input,
        body.login div#login form#lostpasswordform input {
            background: transparent;
            border-radius: 0;
            padding: 8px 0px;
            font-size: 18px;
            box-shadow: none;
            text-shadow: none;
            border: 0px solid transparent;
            border-bottom: 1px solid #000000;
            font-weight: bold;
        }

        body.login div#login form#loginform input:focus,
        body.login div#login form#lostpasswordform input:focus {
            background: transparent;
        }

        body.login div#login form#loginform input[type="checkbox"],
        body.login div#login form#lostpasswordform input[type="checkbox"] {
            border: 1px solid #000000;
        }

        body.login div#login form#loginform p.submit input#wp-submit,
        body.login div#login form#lostpasswordform p.submit input#wp-submit {
            background: #D9027D;
            padding: 13px 28px;
            font-size: 18px;
            text-transform: lowercase;
            box-shadow: none;
            color: #ffffff;
            text-decoration: none;
            transition: 0.4s ease;
            -moz-transition: 0.4s ease;
            -webkit-transition: 0.4s ease;
            height: auto;
            border: 1px solid #D9027D;
            line-height: 1;
        }

        body.login div#login form#loginform p.submit input#wp-submit.focus,
        body.login div#login form#loginform p.submit input#wp-submit.hover,
        body.login div#login form#loginform p.submit input#wp-submit:focus,
        body.login div#login form#loginform p.submit input#wp-submit:hover,
        body.login div#login form#lostpasswordform p.submit input#wp-submit.focus,
        body.login div#login form#lostpasswordform p.submit input#wp-submit.hover,
        body.login div#login form#lostpasswordform p.submit input#wp-submit:focus,
        body.login div#login form#lostpasswordform p.submit input#wp-submit:hover {
            background: #D9027D;
            color: #ffffff;
        }

        body.login div#login p#nav,
        body.login div#login p#backtoblog {
            text-align: center;
        }

        body.login #backtoblog a,
        body.login #nav a,
        body.login .privacy-policy-page-link a {
            color: #000000;
            text-decoration: none;
            transition: 0.4s ease;
            -moz-transition: 0.4s ease;
            -webkit-transition: 0.4s ease;
        }

        body.login #backtoblog a:hover,
        body.login #nav a:hover,
        body.login .privacy-policy-page-link a:hover {
            color: #D9027D;
        }

        body.login .privacy-policy-page-link {
            margin-top: 30px;
        }



        body.login #backtoblog {
            margin-top: 10px !important;
        }

        .dashicons {
            color: #000000;
        }
    </style>
<?php }
add_action('login_enqueue_scripts', 'kobu_login_logo');

/**
 * Change the logo URL in the admin login screen
 */
function logo_website_url($url)
{
    return get_bloginfo('url');
}
add_filter('login_headerurl', 'logo_website_url');

/**
 * Change Login Title
 */
function login_website_title()
{
    return get_bloginfo('name');
}
add_filter('login_headertext', 'login_website_title');


/**
 * Enable Options Page
 */
if (function_exists('acf_add_options_page')) {

    acf_add_options_page(array(
        'page_title'     => 'Site Settings',
        'menu_title'    => 'Site Settings',
        'menu_slug'     => 'site-settings',
        'capability'    => 'edit_posts',
        'redirect'        => false
    ));
}

/**
 * Register metabox with classes info
 */
function register_classes_info_metabox()
{
    add_meta_box(
        'classes_info_metabox',
        'Extra Classes',
        'kobu_classes_info_mb_callback',
        array('post', 'page'),
        'side'
    );
}
add_action('add_meta_boxes', 'register_classes_info_metabox');

function kobu_classes_info_mb_callback($post)
{
    echo     '<p>Available classes to use with blocks:</p>';
    echo     '<dl class="extra-classes-meta-box">
			  <dt>larger-section</dt>
			  <dd>Larger section (use with align wide).</dd>
			</dl>';
}

/**
 * Remove comments
 */

// Remove side menu
add_action('admin_menu', 'remove_default_post_type');
function remove_default_post_type()
{
    remove_menu_page('edit-comments.php');
}

// Removes comments from all apost types
add_action('admin_init', 'remove_comment_support', 100);
function remove_comment_support()
{
    $post_types = get_post_types();
    foreach ($post_types as $post_type) {
        if (post_type_supports($post_type, 'comments')) {
            remove_post_type_support($post_type, 'comments');
        }
    }
}

// Removes comments from admin bar
function cmf_admin_bar_render()
{
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('comments');
}
add_action('wp_before_admin_bar_render', 'cmf_admin_bar_render');


/**
 * Add local ACF JSON to improve performance
 */

add_filter('acf/settings/save_json', 'kobu_acf_json_save_point');
 
function kobu_acf_json_save_point( $path ) {
    $path = get_stylesheet_directory() . '/inc/components/acf';
    return $path;
}

add_filter('acf/settings/load_json', 'kobu_acf_json_load_point');

function kobu_acf_json_load_point( $paths ) {
    unset($paths[0]);
    $paths[] = get_stylesheet_directory() . '/inc/components/acf';
    return $paths;
    
}

/**
 * Google maps
 */

/*
function kobu_google_map_api($api)
{
	$api['key'] = '';
	return $api;
}
add_filter('acf/fields/google_map/api', 'kobu_google_map_api');
*/