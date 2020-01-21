<?php
/**
 * Template Name: Homepage
 *
 * @package mywptheme
 */

get_header(); ?>
	<div id="primary" class="content-area clear">
		<div id="fullheight-top">
		</div>

		<article id="content" class="site-content" role="main">
			<?php while ( have_posts() ) : the_post(); ?>
				<?php if ( get_the_content() !== '' ) { ?>
					<?php the_content(); ?>
				<?php } ?>
			<?php endwhile; ?>
		</article><!-- #content -->
	</div><!-- #primary -->
<?php get_footer(); ?>