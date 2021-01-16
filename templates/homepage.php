<?php
/**
 * Template Name: Homepage
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
				<?php
				if (has_post_thumbnail()) {
					$attachment_id = get_post_thumbnail_id();
					$alt = esc_attr(get_post_meta($attachment_id, '_wp_attachment_image_alt', true));
					$size = '1536x1536';
				?>
					<div class="featured-img">
						<img src="<?php echo wp_get_attachment_image_url($attachment_id, $size); ?>" srcset="<?php echo wp_get_attachment_image_srcset($attachment_id, $size); ?>" sizes="100vw" alt="<?php echo $alt; ?>" />
					</div>
				<?php } ?>

				<?php the_content(); ?>
			</div>
		<?php endwhile; ?>
	</article><!-- #content -->
</div><!-- #primary -->
<?php get_footer(); ?>