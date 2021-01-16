<?php
/**
 * Custom pagination functions
 *
 * @package mywptheme
 */

/**
	Numbered pagination
**/
if ( ! function_exists( 'kobu_pagination') ) {
	function kobu_pagination() {
		global $wp_query,$kobu_query;
		if ( $kobu_query ) {
			$total = $kobu_query->max_num_pages;
		} else {
			$total = $wp_query->max_num_pages;
		}
		$big = 999999999; // need an unlikely integer
		if ( $total > 1 )  {
			 if ( !$current_page = get_query_var( 'paged') )
				 $current_page = 1;
			 if ( get_option( 'permalink_structure') ) {
				 $format = 'page/%#%/';
			 } else {
				 $format = '&paged=%#%';
			 }
			echo paginate_links(array(
				'base'		=> str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
				'format'	=> $format,
				'current'	=> max( 1, get_query_var( 'paged') ),
				'total'		=> $total,
				'mid_size'	=> 2,
				'type'		=> 'list',
				'prev_text'	=> '<i class="fa fa-angle-left"></i>',
				'next_text'	=> '<i class="fa fa-angle-right"></i>',
			 ));
		}
	}
}



/**
	Next/Previous page style pagination
 **/
if (!function_exists('kobu_jump_page')) {
	function kobu_jump_page($direction = 'next', $current_page = '', $total = '', $base = '')
	{
		global $wp;

		if ($current_page == '') {
			$current_page = (get_query_var('paged')) ? get_query_var('paged') : 1;
		}

		if ($total == '') {
			global $wp_query;
			$total = $wp_query->max_num_pages;

			if (!$total || $total < 2) {
				return;
			}
		}

		if (!$base) {
			$current_url = home_url($wp->request);
			$position = strpos($current_url, '/page');
			$nopaging_url = ($position) ? substr($current_url, 0, $position) : $current_url;
			parse_str($_SERVER['QUERY_STRING'], $arr_params);

			$next_page_url = esc_url(add_query_arg($arr_params, $nopaging_url . '/page/' . ($current_page + 1) . '/'));
			$prev_page_url = esc_url(add_query_arg($arr_params, $nopaging_url . (($current_page - 1) > 1 ? '/page/' . ($current_page - 1) . '/' : '')));
		} else {
			$next_page_url = str_replace('%#%', $current_page + 1, esc_url($base));
			$prev_page_url = str_replace('%#%', $current_page - 1, esc_url($base));
		}

		if ($direction == 'next' && $current_page < $total) {
			printf('<div class="pagination-wrapper next container text-center"><a class="btn large next-posts" href="%s" data-page="%s">%s</a></div>', $next_page_url, $current_page + 1, __('carregar mais', 'kobu'));
		} elseif ($direction == 'prev' && $current_page > 1) {
			printf('<div class="pagination-wrapper previous container text-center"><a class="btn large previous-posts" href="%s" data-page="%s">%s</a></div>', $prev_page_url, $current_page - 1, __('carregar anteriores', 'kobu'));
		}
	}
}
