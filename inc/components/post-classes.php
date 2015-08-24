<?php
/**
 * Adds classes to entries
 *
 * @package mywptheme
 */


add_filter('post_class', 'kobu_post_entry_classes');

if ( ! function_exists( 'kobu_post_entry_classes' ) ) {

	function kobu_post_entry_classes( $classes ) {
		
		// Post Data
		global $post, $wpex_count;
		$post_id = $post->ID;
		$post_type = get_post_type($post_id);

		// Do nothing for slides
		if ( $post_type == 'slides' ) {
			return $classes;
		}

		// Search results
		if ( is_search() ) {
			$classes[] = 'search-entry';
			if ( !has_post_thumbnail() ) {
				$classes[] = 'no-featured-image';
			}
			return $classes;
		}

		// Custom class for non standard post types
		if ( $post_type !== 'post' ) {
			$classes[] = $post_type .'-entry';
		}

		// Counter
		if ( $wpex_count ) {
			$classes[] = 'count-'. $wpex_count;
		}
		
		// Return classes
		return $classes;
		
	} // End function
	
} // End if