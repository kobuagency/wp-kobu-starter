<?php
/**
 * This file contains important backend functionality.
 *
 * @package mywptheme
 */

 /* Change the Login Admin Screen */
function kobu_login_logo() { ?>
	<style type="text/css">
	body.login {
	    background-color: #ffffff;
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
    

	body.login div#login > p, #login_error, .login .message {
	    width: 350px !important;
	    margin: 20px auto !important;
	    box-shadow: none !important;
	}
    
    body.login div#login h1 a {
	    background-image: url(<?php echo MYWPTHEME_THEME_URL; ?>/assets/images/main-logo.svg);
	    background-size: 100%;
	    height: 144px;
    	width: 280px;
	    margin: 0 auto 30px auto;
	    display: inline-block;
    }
	
	body.login div#login form {
	    margin-top: 20px;
	    padding: 30px;
	    background: #F5F5F5;
	    -webkit-box-shadow: none;
	    box-shadow: none;
	    border: 0px solid transparent;
	    border-radius: 3px;
	    width: 320px;
	    margin: 0 auto;
	}
	
	body.login div#login form#loginform input, body.login div#login form#lostpasswordform input {
	    background: #ffffff;
	    border-radius: 3px;
	    padding: 8px 10px;	    
	    font-size: 15px;
	    box-shadow: none;
	    text-shadow: none;
	    border: 0px solid transparent;
	}
	
	body.login div#login form#loginform input:focus, body.login div#login form#lostpasswordform input:focus {
	    background: #ffffff;
	}
	
	body.login div#login form#loginform p.submit input#wp-submit, body.login div#login form#lostpasswordform p.submit input#wp-submit {
	    background: transparent;
	    border-color: transparent;
	    padding: 2px 15px;
	    font-size: 13px;
	    text-transform: uppercase;
	    box-shadow: none;
	    color: #80CCC1;
	    text-decoration: none;
	    transition: 0.4s ease;
	    -moz-transition: 0.4s ease;
	    -webkit-transition: 0.4s ease;	    
	    height: auto;
	    border: 1px solid #80CCC1;
	}
	
	body.login div#login form#loginform p.submit input#wp-submit.focus,
	body.login div#login form#loginform p.submit input#wp-submit.hover,
	body.login div#login form#loginform p.submit input#wp-submit:focus,
	body.login div#login form#loginform p.submit input#wp-submit:hover,
	body.login div#login form#lostpasswordform p.submit input#wp-submit.focus,
	body.login div#login form#lostpasswordform p.submit input#wp-submit.hover,
	body.login div#login form#lostpasswordform p.submit input#wp-submit:focus,
	body.login div#login form#lostpasswordform p.submit input#wp-submit:hover {
	    background: #80CCC1;
	    color: #ffffff;
	}
	
	body.login div#login p#nav,
	body.login div#login p#backtoblog { text-align: center; }

	body.login #backtoblog a:hover, body.login #nav a:hover {
	    color: #80CCC1;
	}

	body.login .privacy-policy-page-link {
		margin-top: 30px;
	}

	body.login .privacy-policy-page-link a {
		color: #80CCC1;
		text-decoration: none;
	}

	body.login .privacy-policy-page-link a:hover {
		color: #006580;
	}
    </style>
<?php }
add_action( 'login_enqueue_scripts', 'kobu_login_logo' );

// Change the logo URL in the admin login screen
function logo_website_url( $url ) {
    return get_bloginfo( 'url' );
}
add_filter( 'login_headerurl', 'logo_website_url' );

// Change Login Title
function login_website_title() {
	return get_bloginfo('name');
}
add_filter( 'login_headertext', 'login_website_title' );

/**
 * Enable Options Page
 */
if( function_exists('acf_add_options_page') ) {
	
	acf_add_options_page(array(
		'page_title' 	=> 'Site Settings',
		'menu_title'	=> 'Site Settings',
		'menu_slug' 	=> 'site-settings',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
	
}