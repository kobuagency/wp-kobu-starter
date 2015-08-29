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
	    background-color: #1F1F1F;
	}
        body.login div#login h1 a {
	    background-image: url(images/main-logo.svg);
	    background-size: 200px 180px;
	    height: 190px;
	    width: 200px;
	    margin: 0 auto;
        }
	
	body.login div#login form#loginform {
	    margin-top: 10px;
	    margin-left: 0;
	    padding: 26px 24px 46px;
	    background: #353535;
	    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.13);
	    box-shadow: none;
	    border: 1px solid;
	    border-radius: 3px;
	}
	
	body.login div#login form#loginform input {
	    background: #D4D4D4;
	    border-radius: 3px;
	    padding: 3px 10px;	    
	}
	
	body.login div#login form#loginform p.submit input#wp-submit {
	    background: #7D7D7D;
	    border-color: #292929;
	    padding: 0 12px 2px;
	    -webkit-box-shadow: inset 0 1px 0 rgba(120,200,230,.5),0 1px 0 rgba(0,0,0,.15);
	    box-shadow: inset 0 1px 0 #949494,0 1px 0 rgba(0,0,0,.15);
	    color: #fff;
	    text-decoration: none;
	    transition: 0.4s ease;
	    -moz-transition: 0.4s ease;
	    -webkit-transition: 0.4s ease;	    
	}
	
	body.login div#login form#loginform p.submit input#wp-submit.focus,
	body.login div#login form#loginform p.submit input#wp-submit.hover,
	body.login div#login form#loginform p.submit input#wp-submit:focus,
	body.login div#login form#loginform p.submit input#wp-submit:hover {
	    background: #CE1616;
	    border-color: #2D0000;
	    -webkit-box-shadow: inset 0 1px 0 rgba(120,200,230,.6);
	    box-shadow: inset 0 1px 0 #FB6565;
	    color: #fff;
	}
	
	body.login div#login p#nav,
	body.login div#login p#backtoblog { text-align: center; }
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
add_filter( 'login_headertitle', 'login_website_title' );