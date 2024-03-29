<?php
/**
 * Dropdown Menu Walker.
 *
 * @package mywptheme
 */

class Kobu_Dropdown_Walker_Nav_Menu extends Walker_Nav_Menu {
	function display_element($element, &$children_elements, $max_depth, $depth = 0, $args, &$output)
	{
		$id_field = $this->db_fields['id'];
		if (is_object($args[0])) {
			$args[0]->has_children = !empty($children_elements[$element->$id_field]);
		}
		return parent::display_element($element, $children_elements, $max_depth, $depth, $args, $output);
	}


	function start_el(&$output, $item, $depth=0, $args=array(), $id = 0) {
    	$title = $item->title;
    	$permalink = $item->url;
    	$classes = $item->classes;
    	$target = $item->target;
    	$attr_title = $item->attr_title;
		$slug = sanitize_title($title);
		$has_children = false;
		
		if ((!empty($item->classes) && is_array($item->classes) && in_array('menu-item-has-children', $item->classes)) || $args->has_children) {
			$has_children = true;
		}

    	$classes = preg_replace( '/(current(-menu-|[-_]page[-_])(item|parent|ancestor))/', 'active', $classes );
		$classes = preg_replace( '/^((menu|page)[-_\w+]+)+/', '', $classes );

		$classes[] = 'menu-' . $slug;

		$classes = array_unique( $classes );
		$classes = array_filter( $classes, 'mywptheme_is_element_empty' );

    	$output .= '<li class="' . implode(' ', $classes) . '">';

    	//Add SPAN if no Permalink
		if( $permalink && $permalink != '#' ) {
			$target_str = $attr_title_str = '';

			if ($target) {
				$target_str = ' target="' . $target . '"';
			}
			if ($attr_title) {
				$attr_title_str = ' title="' . $attr_title . '"';
			}

			$output .= '<a href="' . $permalink . '"'. $target_str . $attr_title_str .'>';
		} else {
			$output .= '<span>';
		}

		$output .= $title;
		
		if( $permalink && $permalink != '#' ) {
			$output .= '</a>';
		} else {
			$output .= '</span>';
		}

		if ( $has_children ) {
			$output .= ' <button type="button" class="toggle-submenu" aria-expanded="false">' . __('Toggle submenu','kobu') . '</button>';
		}
	}

	function end_el(&$output, $item, $depth=0, $args=array(), $id = 0) {
    	$output .= '</li>';
	}
}

function kobu_nav_menu_args( $args = '' ) {
	$kobu_nav_menu_args = array();

	$kobu_nav_menu_args['container'] = false;

	if ( ! $args['items_wrap'] ) {
		$kobu_nav_menu_args['items_wrap'] = '<ul id="%1$s" class="%2$s">%3$s</ul>';
	}

	if ( ! $args['depth'] ) {
		$kobu_nav_menu_args['depth'] = 2;
	}

	if ( ! $args['walker'] ) {
		$kobu_nav_menu_args['walker'] = new Kobu_Dropdown_Walker_Nav_Menu();
	}

	return array_merge( $args, $kobu_nav_menu_args );
}
add_filter( 'wp_nav_menu_args', 'kobu_nav_menu_args' );
