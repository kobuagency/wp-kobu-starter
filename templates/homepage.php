<?php
/**
 * Template Name: Homepage
 *
 * @package mywptheme
 */

get_header(); ?>

<div id="fullheight-top">

</div>

<div id="tablesite-content" class="autoheight">
	<div id="main-content">
		<div class="dtc">
			<div id="primary" class="content-area clear">
				<div id="content" class="site-content" role="main">
					<?php while ( have_posts() ) : the_post(); ?>
						<article class="homepage-wrap clear">
							<?php
							/**
								Post Content
							**/ ?>
							<?php if ( get_the_content() !== '' ) { ?>
								<div id="homepage-content" class="entry clear">
									<?php the_content(); ?>
								</div><!-- .entry-content -->
							<?php } ?>
						</article><!-- #post -->
						<?php comments_template(); ?>
					<?php endwhile; ?>
				</div><!-- #content -->
			</div><!-- #primary -->
<?php get_footer(); ?>