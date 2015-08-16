<?php
/**
 * This file contains important backend functionality.
 *
 * @package mywptheme
 */

 /* Change the Login Admin Screen */
function kobu_login_logo() { ?>
    <style type="text/css">
        body.login div#login h1 a {
            background-image: url(<?php echo get_stylesheet_directory_uri(); ?>/images/logo-a1k.png);
			background-size: 96px 134px;
			height: 134px;
			width: 96px;
            margin-top: -10px;
        }
    </style>
<?php }
add_action( 'login_enqueue_scripts', 'kobu_login_logo' );