<?php
/**
 * The template for displaying Archive pages.
 *
 * @package mywptheme
 */

get_header(); ?>

	<div id="primary" class="content-area clear">
		<div id="content" class="site-content clear" role="main">
			<header class="page-header">
				<h1 class="page-header-title"><?php
					if ( is_day() ) :
						printf( __( 'Daily Archives: %s', 'wpex' ), get_the_date() );
					elseif ( is_month() ) :
						printf( __( 'Monthly Archives: %s', 'wpex' ), get_the_date( _x( 'F Y', 'monthly archives date format', 'wpex' ) ) );
					elseif ( is_year() ) :
						printf( __( 'Yearly Archives: %s', 'wpex' ), get_the_date( _x( 'Y', 'yearly archives date format', 'wpex' ) ) );
					else :
						echo single_term_title();
					endif;
				?></h1>
				<?php if ( term_description() ) { ?>
					<div id="archive-description" class="clear">
						<?php echo term_description(); ?>
					</div><!-- #archive-description -->
				<?php } ?>
			</header><!-- .page-header -->
			<?php if ( have_posts() ) { ?>
				<div id="blog-wrap" class="clr">   
					<?php while ( have_posts() ) : the_post(); ?>
						<?php get_template_part( 'content', get_post_format() ); ?>
					<?php endwhile; ?>
				</div><!-- #clr -->
				<?php kobu_pagination(); ?>
			<?php } else { ?>
				<?php get_template_part( 'content', 'none' ); ?>
			<?php } ?>
		</div><!-- #content -->
		<?php get_sidebar(); ?>
	</div><!-- #primary -->

<?php get_footer(); ?>