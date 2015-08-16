<?php
/**
 * The Template for displaying all single posts.
 *
 * @package mywptheme
 */

get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>
	<div id="primary" class="content-area clr">
		<div id="content" class="site-content clr" role="main">
			<article class="news-item">

				<div class="left">
					<div class="image">
						<?php the_post_thumbnail('full'); ?>
					</div>										
				</div>
				<div class="right">
					<?php $cat = get_the_category(); ?>
					<div class="category"><?php echo $cat[0]->cat_name ?></div>
					<h4><?php the_title(); ?></h4>
					<div class="text">
						<?php the_content(); ?>
					</div>
				</div>

			</article>
		</div><!-- #content -->
	</div><!-- #primary -->
<?php endwhile; ?>
<?php get_footer(); ?>