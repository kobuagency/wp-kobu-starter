<?php
/**
 * Template Name: Homepage
 *
 * @package mywptheme
 */

get_header(); ?>

	<div id="primary" class="content-area clr">
		<div id="content" class="site-content" role="main">
			<?php while ( have_posts() ) : the_post(); ?>
				<article class="homepage-wrap clr">
					<?php
					/**
						Post Content
					**/ ?>
					<?php if ( get_the_content() !== '' ) { ?>
						<div id="homepage-content" class="entry clr">
							<?php the_content(); ?>
						</div><!-- .entry-content -->
					<?php } ?>
					<?php
					/**
						Features
					**/
					$kobu_query = new WP_Query(
						array(
							'order'				=> 'ASC',
							'orderby'			=> 'menu_order',
							'post_type'			=> 'features',
							'posts_per_page'	=> '-1',
							'no_found_rows'		=> true,
						)
					);
					if ( $kobu_query->posts ) { ?>
						<div id="homepage-features" class="clr">
							<?php $wpex_count=0; ?>
							<?php foreach( $kobu_query->posts as $post ) : setup_postdata( $post ); ?>
								<?php $wpex_count++; ?>
									<?php get_template_part( 'content-features', get_post_format() ); ?>
								<?php if ( $wpex_count == '4' ) { ?>
									<?php $wpex_count=0; ?>
								<?php } ?>
							<?php endforeach; ?>
						</div><!-- #homepage-features -->
					<?php } ?>
					<?php wp_reset_postdata(); ?>
					<?php
					/**
						Portfolio
					**/
					$display_count = get_theme_mod('wpex_home_portfolio_count', '8');
					$kobu_query = new WP_Query(
						array(
							'post_type'			=> 'portfolio',
							'posts_per_page'	=> $display_count,
							'no_found_rows'		=> true,
						)
					);
					if ( $kobu_query->posts ) { ?>
						<div id="homepage-portfolio" class="clr">
							<h2 class="heading"><span><?php _e( 'Recent Work', 'wpex' ); ?></span></h2>
							<?php $wpex_count=0; ?>
							<?php foreach( $kobu_query->posts as $post ) : setup_postdata( $post ); ?>
								<?php $wpex_count++; ?>
									<?php get_template_part( 'content-portfolio', get_post_format() ); ?>
								<?php if ( $wpex_count == '4' ) { ?>
									<?php $wpex_count=0; ?>
								<?php } ?>
							<?php endforeach; ?>
						</div><!-- #homepage-portfolio -->
					<?php } ?>
					<?php wp_reset_postdata(); ?>
					<?php
					/**
						Blog
					**/
					$display_count = get_theme_mod('wpex_home_blog_count', '3');
					$kobu_query = new WP_Query(
						array(
							'post_type'			=> 'post',
							'posts_per_page'	=> $display_count,
							'no_found_rows'		=> true,
						)
					);
					if ( $kobu_query->posts ) { ?>
						<div id="homepage-blog" class="clr">
							<h2 class="heading"><span><?php _e( 'From The Blog', 'wpex' ); ?></span></h2>
							<?php $wpex_count=0; ?>
							<?php foreach( $kobu_query->posts as $post ) : setup_postdata( $post ); ?>
								<?php $wpex_count++; ?>
									<article class="recent-blog-entry clr col span_1_of_3 col-<?php echo $wpex_count; ?>">
										<?php
										// Display post thumbnail
										if ( has_post_thumbnail() ) { ?>
											<div class="recent-blog-entry-thumbnail">
												<a href="<?php the_permalink(); ?>" title="<?php echo esc_attr( the_title_attribute( 'echo=0' ) ); ?>">
													<img src="<?php echo wpex_get_featured_img_url(); ?>" alt="<?php echo esc_attr( the_title_attribute( 'echo=0' ) ); ?>" />
												</a>
											</div><!-- .recent-blog-entry-thumbnail -->
										<?php } ?>
										<header>
											<h3 class="recent-blog-entry-title"><a href="<?php the_permalink(); ?>" title="<?php echo esc_attr( the_title_attribute( 'echo=0' ) ); ?>"><?php the_title(); ?></a></h3>
											<?php
											// Display post meta details
											wpex_post_meta() ;?>
										</header>
										<div class="recent-blog-entry-content entry clr">
											<?php wpex_excerpt( 18, false ); ?>
										</div><!-- .recent-blog-entry-content -->
									</article><!-- .recent-blog -->
								<?php if ( $wpex_count == '3' ) { ?>
									<?php $wpex_count=0; ?>
								<?php } ?>
							<?php endforeach; ?>
						</div><!-- #homepage-portfolio -->
					<?php } ?>
					<?php wp_reset_postdata(); ?>
				</article><!-- #post -->
				<?php comments_template(); ?>
			<?php endwhile; ?>
		</div><!-- #content -->
	</div><!-- #primary -->
<?php get_footer(); ?>