<?php
/**
 * The default template for displaying post content.
 *
 * @package mywptheme
 */



/**
	Entries
**/

if ( is_singular() && is_main_query() ) { ?>

	<?php if ( has_post_thumbnail() ) { ?>
		<div class="post-thumbnail">
			<img src="<?php echo kobu_get_featured_img_url(); ?>" alt="<?php echo esc_attr( the_title_attribute( 'echo=0' ) ); ?>" />
		</div><!-- .post-thumbnail -->
	<?php } ?>

<?php }

/**
	Posts
**/
else { ?>

	<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		<?php
		// Display post thumbnail
		if ( has_post_thumbnail() ) { ?>
			<div class="loop-entry-thumbnail">
				<a href="<?php the_permalink(); ?>" title="<?php echo esc_attr( the_title_attribute( 'echo=0' ) ); ?>">
					<img src="<?php echo kobu_get_featured_img_url(); ?>" alt="<?php echo esc_attr( the_title_attribute( 'echo=0' ) ); ?>" />
				</a>
			</div><!-- .post-entry-thumbnail -->
		<?php } ?>
		<div class="loop-entry-text clr">
			<header>
				<h2 class="loop-entry-title"><a href="<?php the_permalink(); ?>" title="<?php echo esc_attr( the_title_attribute( 'echo=0' ) ); ?>"><?php the_title(); ?></a></h2>
				<?php
				// Display post meta details
				kobu_post_meta() ;?>
			</header>
			<div class="loop-entry-content entry clr">
				<?php the_content(); ?>
			</div><!-- .loop-entry-content -->
		</div><!-- .loop-entry-text -->
	</article><!-- .loop-entry -->

<?php } ?>