<?php
/**
 * The template for displaying 404 pages
 *
 * @package mywptheme
 */

get_header(); ?>

<div id="primary" class="content-area">
	<div id="content" class="error-page fullheight-top" role="main">
		<div class="error-page-content">
			<h1 class="error-page-title">404</h1>
			<div class="error-page-message">
				<p><?php _e('Unfortunately, the page you tried accessing could not be retrieved.'); ?></p>
				<a class="btn white" href="<?php echo home_url(); ?>"><?php _e('back to homepage', 'kobu'); ?></a>
			</div>
		</div>
	</div><!-- #content -->
</div><!-- #primary -->

<?php get_footer(); ?>