<?php
/**
 * Ajax queries
 *
 * @package mywptheme
 */

add_action( 'wp_ajax_nopriv_ajax_filters', 'query_ajax_filters' );
add_action( 'wp_ajax_ajax_filters', 'query_ajax_filters' );

function query_ajax_filters() {
    global $post;

    if( isset( $_POST['page_num'] ) ) {
        if (is_numeric($_POST['page_num'])) {
            $paged = $_POST['page_num'];
        } else {
            $paged = 1;
        }
    } else {
        $paged = 1;
    }

    if( isset( $_POST['post_type'] ) ) {
        $post_type = sanitize_text_field( $_POST['post_type'] );
    } else {
        $post_type = 'post';
    }

    $orderby = 'post_date';

    $args = array(
                'post_type'      => $post_type,
                'posts_per_page' => 6,
                'order'          => 'DESC',
                'orderby'        => $orderby,
                'post_status'    => 'publish',
                'paged'          => $paged
             );

    $ajax_query = new WP_Query( $args );

    if ( $ajax_query->have_posts() ) {
        $total = $ajax_query->max_num_pages;
        ?>

        <?php while ( $ajax_query->have_posts() ) : $ajax_query->the_post(); ?>
            <?php // print new posts ?> 
        <?php endwhile; ?>
        
        <?php if ($paged < $total) { ?>
            <div class="has-more"></div>
        <?php } ?>

    <?php } else { ?>
        <div class="text-center"><?php _e('Sorry, there are no articles matching your search.','kobu'); ?></div>
    <?php }

    wp_reset_postdata();
    die();
}