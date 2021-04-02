<?php

/**
 * The Template for displaying all pages.
 *
 * @package mywptheme
 */

get_header(); ?>
<div id="primary" class="content-area">
	<article id="content" role="main">
		<?php while (have_posts()) : the_post(); ?>
			<div class="page-title-wrapper">
				<div class="container">
					<h1 class="page-title"><?php the_title(); ?></h1>
				</div>
			</div>

			<div class="site-content">
				<?php if (has_post_thumbnail()) { ?>
					<div class="featured-img">
						<?php echo wp_get_attachment_image(get_post_thumbnail_id(get_the_ID()), '1536x1536', false, array('class' => 'coverimg', 'sizes' => '100vw'));  ?>
					</div>
				<?php } ?>

				<?php the_content(); ?>
			</div>
		<?php endwhile; ?>
	</article><!-- #content -->
</div><!-- #primary -->
<?php get_footer(); ?>