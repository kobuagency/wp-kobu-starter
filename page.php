<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that other
 * 'pages' on your WordPress site will use a different template.
 *
 * @package mywptheme
 */

get_header(); ?>
	<div id="primary" class="content-area">
		<article id="content" role="main">
			<?php while ( have_posts() ) : the_post(); ?>
				<h1 class="page-title"><?php the_title(); ?></h1>

				<div class="site-content">
					<?php if ( has_post_thumbnail() ) { ?>
						<div class="page-thumbnail">
							<img src="<?php echo kobu_get_featured_img_url(); ?>" alt="<?php echo esc_attr( the_title_attribute( 'echo=0' ) ); ?>" />
						</div>
					<?php } ?>

					<?php the_content(); ?>
				</div>
			<?php endwhile; ?>
		</article><!-- #content -->
	</div><!-- #primary -->
<?php get_footer(); ?>