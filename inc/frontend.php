<?php

/**
 * This file contains important frontend functionality.
 *
 * @package mywptheme
 */

function mywptheme_wp_title($sep)
{
	if (defined('WPSEO_VERSION')) {
		wp_title('');
	} else {
		wp_title($sep, true, 'right');
		if (!is_feed()) {
			global $page, $paged;

			bloginfo('name', 'display');

			$site_description = get_bloginfo('description', 'display');
			if ($site_description && (is_home() || is_front_page())) {
				echo ' ' . $sep . ' ' . $site_description;
			}

			if (($paged >= 2 || $page >= 2) && !is_404()) {
				echo ' ' . $sep . ' ' . sprintf(__('Page %s', 'mywptheme'), max($paged, $page));
			}
		}
	}
}

/* WPML Language Switcher */
function language_selector_flags()
{
	$langs = '';
	$languages = apply_filters('wpml_active_languages', NULL, 'skip_missing=0');

	if (!empty($languages)) {
		$languages['pt-pt']['language_code'] = 'pt';

		echo '<div class="language-wrapper">';
		echo '<div class="lang-selector-group">';

		echo '<div class="current-lang" aria-label="' . __('Idioma atual', 'kobu') . '">';
		echo '<div class="current-lang-code">';
		if (ICL_LANGUAGE_CODE == 'pt-pt') {
			echo "pt";
		} else {
			echo ICL_LANGUAGE_CODE;
		}
		echo '</div>';
		echo kobu_get_icons('arrow_down');
		echo '</div>';

		echo '<div class="lang-selector" aria-label="' . __('Selecionar idioma', 'kobu') . '">';
		foreach ($languages as $l) {
			if (isset($l['url']) && !$l['active']) {
				$langs .=  '<a class="lang" href="' . esc_url($l['url']) . '">' . strtoupper($l['language_code']) . '</a>   ';
			}
		}
		echo $langs;
		echo '</div>';

		echo '</div>';
		echo '</div>';
	}
}


/**
 * Return current path with language
 *
 */
function kobu_get_current_path()
{
	global $wp;

	$page_path = explode('/page', $wp->request);
	$path_str = $page_path[0];

	if (function_exists('icl_get_languages')) {
		$default_lang = apply_filters('wpml_default_language', NULL);
		$current_lang = ICL_LANGUAGE_CODE;

		if ($default_lang != $current_lang) {
			$path_str = $current_lang . '/' . $path_str;
		}
	}

	return $path_str;
}


/**
 * Print CTA clone link
 *
 */

function kobu_print_cta($cta, $classes = 'btn', $withtarget = true)
{
	if ($cta && isset($cta['text']) && $cta['text'] && ((isset($cta['link']) && $cta['link']) || (isset($cta['section_id']) && $cta['section_id']))) {
		if ($withtarget && isset($cta['target_blank']) && $cta['target_blank'] && $cta['link_type'] !== 'section') {
			$target = 'target="_blank"';
		} else {
			$target = '';
		}

		if ($cta['link_type'] == 'section' && isset($cta['section_id'])) {
			$classes .= ' anchorlink';
			$link = '#' . esc_attr($cta['section_id']);
		} elseif ($cta['link_type'] == 'page_section' && isset($cta['section_id']) && isset($cta['link']) && $cta['link']) {
			$link = esc_url($cta['link']).'#' . esc_attr($cta['section_id']);
		} else {
			$link = esc_url($cta['link']);
		}

		echo '<a href="' . $link . '" class="' . ($classes ? $classes : 'btn') . '" ' . $target . '>' . $cta['text'] . '</a>';
	}
}

/**
 * Print Media clone
 *
 */

function kobu_print_video_elem($media, $loadvideo = false, $echo = true, $imgsize = 'full', $blockAutoplay = false)
{
	$output = '';

	if (wp_is_mobile() && $media['video_img_mobile']) {
		if ($imgsize == 'full') {
			$video_img_mobile_url = $media['video_img_mobile']['url'];
		} else {
			$video_img_mobile_url = $media['video_img_mobile']['sizes'][$imgsize];
		}

		$output .= '<figure class="media-wrapper img" style="background-image: url(' . $video_img_mobile_url . ');"><div class="img-wrapper"><img src="' . $video_img_mobile_url . '" alt="' . $media['video_img_mobile']['alt'] . '"></div></figure>';
	} else {
		$videoPlaceholder = '';
		$autoplay = $blockAutoplay ? false : $media['video_autoplay'];

		if ($media['placeholder']) {
			if ($imgsize == 'full') {
				$placeholder = $media['placeholder']['url'];
			} else {
				$placeholder = $media['placeholder']['sizes'][$imgsize];
			}

			$videoPlaceholder .= '<div class="video-placeholder" style="background-image: url(' . $placeholder . ')">';
			$videoPlaceholder .= '<img src="' . $placeholder . '" alt="' . $media['placeholder']['alt'] . '">';
			$videoPlaceholder .= '</div>';
		}

		$videoOutput = '<video playsinline ' . ($autoplay ? ' autoplay' : '') . ($media['video_muted'] ? ' muted' : '') . ($media['video_loop'] ? ' loop' : '') . ($media['video_controls'] ? ' controls' : '') . '>';
		$videoOutput .= '<source src="' . $media['media']['url'] . '" type="video/' . $media['video_format'] . '" />';
		if ($media['video_format'] == 'webm' && $media['media_mp4']) {
			$videoOutput .= '<source src="' . $media['media_mp4']['url'] . '" type="video/mp4" />';
		}
		$videoOutput .= '</video>';

		if ($loadvideo) {
			$output .= '<figure class="kb-video media-wrapper video-loaded">';
			$output .= '<div class="video-wrapper">';
			$output .= $videoPlaceholder;
			$output .= $videoOutput;
			$output .= '</div>';
			$output .= '</figure>';
		} else {
			$videoSettings = [
				'webm' => $media['video_format'] == 'webm' ? $media['media']['url'] : '',
				'mp4' => $media['video_format'] == 'webm' && $media['media_mp4'] ? $media['media_mp4']['url'] : ($media['video_format'] == 'mp4' ? $media['media']['url'] : ''),
				'ogg' => '',
				'track' => '',
				'trackKind' => '',
				'trackSrclang' => '',
				'autoplay' => $autoplay,
				'loop' => $media['video_loop'],
				'muted' => $media['video_muted'],
				'controls' => $media['video_controls'],
				'preload' => 'metadata',
			];

			$output .= '<figure class="kb-video media-wrapper pageload-video" data-settings="' . htmlspecialchars(json_encode($videoSettings)) . '">';
			$output .= $videoPlaceholder;
			$output .= '<noscript>';
			$output .= $videoOutput;
			$output .= '</noscript>';
			$output .= '</figure>';
		}
	}

	if ($echo) {
		echo $output;
	} else {
		return $output;
	}
}

function kobu_print_media_elem($media, $loadvideo = false, $echo = true, $imgsize = 'full', $blockAutoplay = false)
{
	$output = '';

	if ($media && ($media['media_video'] || $media['media_img'])) {
		if ($media['media_type'] == 'img') {
			if ($imgsize == 'full') {
				$image = $media['media_img']['url'];
			} else {
				$image = $media['media_img']['sizes'][$imgsize];
			}

			$output .= '<figure class="media-wrapper img" style="background-image: url(' . $image . ');"><div class="img-wrapper"><img src="' . $image . '" alt="' . $media['media_img']['alt'] . '"></div></figure>';
		} elseif ($media['media_type'] == 'video' && $media['media_video']['video']) {
			$output .= kobu_print_video_elem($media['media_video']['video'], $loadvideo, false, $imgsize, $blockAutoplay);
		}
	}

	if ($echo) {
		echo $output;
	} else {
		return $output;
	}
}


/**
 * Image lazy load wrapper
 *
 */
function lazyload_img_block_wrapper($block_content, $block)
{
	if ($block['blockName'] === 'core/image') {
		$content = '<noscript class="loading-lazy">';
		$content .= $block_content;
		$content .= '</noscript>';
		return $content;
	}
	return $block_content;
}

add_filter('render_block', 'lazyload_img_block_wrapper', 10, 2);


/**
 * change excerpt size
 *
 */
function kobu_excerpt_length()
{
	global $post;

	return 25;
}

add_filter('excerpt_length', function ($length) {
	return kobu_excerpt_length();
});


/**
 * Get terms links
 *
 */
function kobu_list_terms($taxonomy_slug = 'category', $output = 'string', $link = true, $list = false, $post_id = null)
{
	if (!$post_id) {
		if (!$post = get_post()) {
			return '';
		}

		$post_id = $post->ID;
	}

	$taxonomy_slug = $taxonomy_slug ? $taxonomy_slug : 'category';
	$terms = get_the_terms($post_id, $taxonomy_slug);

	if ($output == 'array') {
		return $terms;
	}

	if (!empty($terms)) {
		if ($list) {
			$wrapperElem = 'ul';
		} else {
			$wrapperElem = 'div';
		}
		foreach ($terms as $term) {
			if ($term->term_id != 1) {
				$elem = '';

				if ($list) {
					$elem .= '<li>';
				}
				if ($link) {
					$elem .= sprintf(
						'<a href="%1$s">%2$s</a>',
						$taxonomy_slug == 'category' ? esc_url(get_permalink(get_option('page_for_posts')) . '?category=' . $term->slug) : esc_url(get_term_link($term->slug, $taxonomy_slug)),
						esc_html($term->name)
					);
				} else {
					$elem .= sprintf(
						'<span>%1$s</span>',
						esc_html($term->name)
					);
				}
				if ($list) {
					$elem .= '</li>';
				}

				$out[] = $elem;
			}
		}

		if (!empty($out)) {
			return sprintf('<%1$s class="categories">%2$s</%1$s>', $wrapperElem, $list ? implode('', $out) : implode(', ', $out));
		}
	}

	return;
}