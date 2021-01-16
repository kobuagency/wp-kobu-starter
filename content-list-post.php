<?php

/**
 * Partial: Article list element
 *
 * @package mywptheme
 */
?>

<li class="article col33 <?php echo (defined('DOING_AJAX') && DOING_AJAX) ? 'ajax-posts' : ''; ?>">
    <a href="<?php the_permalink(); ?>">
        <?php if (has_post_thumbnail()) {
            $attachment_id = get_post_thumbnail_id();
            $alt = get_post_meta($attachment_id, '_wp_attachment_image_alt', true);
            $size = 'medium_large';
        ?>
            <div class="fixed-ratio-img">
                <noscript class="loading-lazy">
                    <img class="coverimg" src="<?php echo wp_get_attachment_image_url($attachment_id, $size); ?>" srcset="<?php echo wp_get_attachment_image_srcset($attachment_id, $size); ?>" sizes="(min-width: 993px) 33vw, (min-width: 601px) 50vw, 100vw" alt="<?php echo $alt; ?>" />
                </noscript>
            </div>
        <?php  } else { ?>
            <div class="empty-img"></div>
        <?php } ?>
        <div class="content-wrapper">
            <?php echo kobu_list_terms('category', 'string', false, false, get_the_ID()); ?>
            <h3 class="post-title"><?php echo get_the_title(get_the_ID()); ?></h3>
            <div class="post-date"><?php echo date_i18n(__(get_option('date_format'), 'kobu'), get_post_time()); ?></div>
            <div class="excerpt"><?php echo get_the_excerpt(get_the_ID()); ?></div>
            <div class="read-more"><?php _e('read more', 'kobu'); ?></div>
        </div>
    </a>
</li>