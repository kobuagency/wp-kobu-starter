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

	<div id="primary" class="content-area clear">
		<?php if ( !is_front_page() ) { ?>
			<header class="page-header clear">
				<h1 class="page-header-title"><?php the_title(); ?></h1>
			</header><!-- #page-header -->
		<?php } ?>
		<div id="content" class="site-content" role="main">
			<?php while ( have_posts() ) : the_post(); ?>
				<?php if ( has_post_thumbnail() ) { ?>
					<div class="page-thumbnail">
						<img src="<?php echo kobu_get_featured_img_url(); ?>" alt="<?php echo esc_attr( the_title_attribute( 'echo=0' ) ); ?>" />
					</div><!-- .page-thumbnail -->
				<?php } ?>
				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
					<div class="entry clear">
						<?php the_content(); ?>						
					</div><!-- .entry-content -->
				</article><!-- #post -->
				<?php comments_template(); ?>
			<?php endwhile; ?>
		</div><!-- #content -->
		<?php get_sidebar(); ?>
	</div><!-- #primary -->
<?php get_footer(); ?>