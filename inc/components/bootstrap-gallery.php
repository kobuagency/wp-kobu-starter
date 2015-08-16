<?php
/**
 * Clean Bootstrap gallery.
 *
 * from Roots theme (http://roots.io/).
 *
 * @package mywptheme
 */

function mywptheme_gallery( $attr ) {
	$post = get_post();

	static $instance = 0;
	$instance++;

	if ( ! empty( $attr['ids'] ) ) {
		if ( empty( $attr['orderby'] ) ) {
			$attr['orderby'] = 'post__in';
		}
		$attr['include'] = $attr['ids'];
	}

	$output = apply_filters( 'post_gallery', '', $attr );

	if ( $output != '' ) {
		return $output;
	}

	if ( isset( $attr['orderby'] ) ) {
		$attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
		if ( ! $attr['orderby'] ) {
			unset($attr['orderby']);
		}
	}

	extract( shortcode_atts( array(
		'order'			=> 'ASC',
		'orderby'		=> 'menu_order ID',
		'id'			=> $post->ID,
		'itemtag'		=> '',
		'icontag'		=> '',
		'captiontag'	=> '',
		'columns'		=> 4,
		'size'			=> 'thumbnail',
		'include'		=> '',
		'exclude'		=> '',
		'link'			=> '',
	), $attr ) );

	$id = absint( $id );
	$columns = ( 12 % $columns == 0 ) ? $columns: 4;
	$xs_columns = 1;
	if ( $columns % 2 == 0 ) {
		$xs_columns = $columns / 2;
	}
	$grid = sprintf( 'col-xs-%2$s col-sm-%1$s col-lg-%1$s', 12 / $columns, 12 / $xs_columns);

	if ( $order === 'RAND' ) {
		$orderby = 'none';
	}

	if ( ! empty( $include ) ) {
		$_attachments = get_posts( array(
			'include'			=> $include,
			'post_status'		=> 'inherit',
			'post_type'			=> 'attachment',
			'post_mime_type'	=> 'image',
			'order'				=> $order,
			'orderby'			=> $orderby,
		) );

		$attachments = array();
		foreach ( $_attachments as $key => $val )
		{
			$attachments[$val->ID] = $_attachments[$key];
		}
	} elseif ( ! empty( $exclude ) ) {
		$attachments = get_children( array(
			'post_parent'		=> $id,
			'exclude'			=> $exclude,
			'post_status'		=> 'inherit',
			'post_type'			=> 'attachment',
			'post_mime_type'	=> 'image',
			'order'				=> $order,
			'orderby'			=> $orderby,
		) );
	} else {
		$attachments = get_children( array(
			'post_parent'		=> $id,
			'post_status'		=> 'inherit',
			'post_type'			=> 'attachment',
			'post_mime_type'	=> 'image',
			'order'				=> $order,
			'orderby'			=> $orderby,
		) );
	}

	if ( empty( $attachments ) ) {
		return '';
	}

	if ( is_feed() ) {
		$output = "\n";
		foreach ( $attachments as $att_id => $attachment )
		{
			$output .= wp_get_attachment_link( $att_id, $size, true ) . "\n";
		}
		return $output;
	}

	$unique = ( get_query_var( 'page' ) ) ? $instance . '-p' . get_query_var( 'page' ): $instance;
	$output = '<div id="gallery-' . $id . '-' . $unique . '" class="gallery">';

	$i = 0;
	foreach ( $attachments as $id => $attachment ) {
		switch ( $link ) {
			case 'file':
				$image = wp_get_attachment_link( $id, $size, false, false );
				break;
			case 'none':
				$image = wp_get_attachment_image( $id, $size, false, array( 'class' => 'img-thumbnail' ) );
				break;
			default:
				$image = wp_get_attachment_link( $id, $size, true, false );
		}
		$output .= ( $i % $columns == 0 ) ? '<div class="row gallery-row">' : '';
		$output .= '<div class="' . $grid .' text-center">' . $image;

		if ( trim( $attachment->post_excerpt ) != '' ) {
			$output .= '<div class="caption hidden">' . wptexturize( $attachment->post_excerpt ) . '</div>';
		}

		$output .= '</div>';
		$i++;
		$output .= ( $i % $columns == 0 ) ? '</div>' : '';
	}

	$output .= ( $i % $columns != 0 ) ? '</div>' : '';
	$output .= '</div>';

	return $output;
}
remove_shortcode( 'gallery' );
add_shortcode( 'gallery', 'mywptheme_gallery' );
add_filter( 'use_default_gallery_style', '__return_null' );

/**
 * Add title class="img-thumbnail" to attachment items
 */
function mywptheme_attachment_link( $html, $id, $size, $permalink = false, $icon = false, $text = false ) {
	$html = str_replace( '<a', '<a title="' . get_the_title( $id ) . '"', $html );
	$html = str_replace( '<a', '<a class="img-thumbnail"', $html );
	return $html;
}
add_filter('wp_get_attachment_link', 'mywptheme_attachment_link', 10, 6);
