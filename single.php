<?php
/**
 * The Template for displaying all single posts.
 *
 * @package mywptheme
 */

get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>
	<div id="primary" class="content-area clear">
		<article id="content" role="main">
			<h1 class="page-title"><?php the_title(); ?></h1>
			
			<div class="site-content">
				<?php the_post_thumbnail('full'); ?>
				<?php the_content(); ?>
			</div>
		</article><!-- #content -->
	</div><!-- #primary -->
<?php endwhile; ?>
<?php get_footer(); ?>