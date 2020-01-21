<?php
/**
 * The Template for displaying all single posts.
 *
 * @package mywptheme
 */

get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>
	<div id="primary" class="content-area clear">
		<article id="content" class="site-content clear" role="main">
			<?php if ( get_the_content() !== '' ) { ?>
				<h1><?php the_title(); ?></h1>
				<?php the_post_thumbnail('full'); ?>
				<?php the_content(); ?>
			<?php } ?>
		</article><!-- #content -->
	</div><!-- #primary -->
<?php endwhile; ?>
<?php get_footer(); ?>