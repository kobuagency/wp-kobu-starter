<?php

/**
 * The template for displaying Archive pages.
 *
 * @package mywptheme
 */

get_header();

$max_pages = $wp_query->max_num_pages;
$current_page = (get_query_var('paged')) ? get_query_var('paged') : 1;

?>
<div id="primary" class="content-area">
    <div class="page-title-wrapper">
        <div class="container">
            <h1 class="page-title"><?php the_title(); ?></h1>
        </div>
    </div>

    <div id="content">
        <div class="container large">
            <input id="posts-currentpage" type="hidden" name="currentpage" value="<?php echo $current_page; ?>">
            <div id="posts-wrapper">
                <?php if (have_posts()) { ?>
                    <?php kobu_jump_page('prev', $current_page, $max_pages); ?>
                    <ul class="articles-list row">
                        <?php
                        while (have_posts()) : the_post();
                            get_template_part('content', 'list-post');
                        endwhile;
                        ?>
                    </ul>
                    <?php kobu_jump_page('next', $current_page, $max_pages); ?>
                <?php } else { ?>
                    <?php get_template_part('content', 'none'); ?>
                <?php } ?>
            </div>
        </div>
    </div>
</div>
<?php get_footer(); ?>