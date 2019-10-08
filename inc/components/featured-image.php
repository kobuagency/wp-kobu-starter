<?php
/**
 * Returns a post featured image URL
 *
 * @package mywptheme
 */


// Returns the site featured image
if ( ! function_exists( 'kobu_get_featured_img_url' ) ) {
	
		function kobu_get_featured_img_url( $size = 'default', $post_id = '', $attachment_id = '', $full_image = false, $main_query = true ) {
			
			// Post Vars
			global $post, $kobu_query;

			$post_id = $post_id ? $post_id : $post->ID;
			$post_type = get_post_type( $post_id );

			if (!$attachment_id) {
				$attachment_id = get_post_thumbnail_id( $post_id );
			}

			if (!$attachment_id) {
				return '';
			}

			if ($size == 'large') {
				$attachment_url = wp_get_attachment_image_src( $attachment_id, 'large' )[0];
			} else {
				$attachment_url = wp_get_attachment_image_src( $attachment_id, 'full' )[0];
			}
			
			// Resizing Vars
			$width = 9999;
			$height = 9999;
			$crop = false;
			
			// Return full image url if set to true
			if ( $full_image ) return $attachment_url;
			
			//Posts list
			if ( $size == 'list' ) {
				$width = 600;
				$height = 390;
				$crop = true;
			}
			
			//Small square
			if ( $size == 'small_square' ) {
				$width = 500;
				$height = 500;
				$crop = true;
			}
			
			//gallery size
			if ( $size == 'xlarge' ) {
				$width = 1500;
				$height = 1500;
			}

		
			// Return Dimensions & crop
			$width = intval($width);
			$width = $width ? $width : 9999;
			$height = intval($height);
			$height = $height ? $height : 9999;
			$width = apply_filters('kobu_featured_image_width', $width );
			$height = apply_filters('kobu_featured_image_height', $height );
			$cropped_image = aq_resize( $attachment_url, $width, $height, $crop, true, true );
			return $cropped_image;
			
			
		} // End function
	
} // End if