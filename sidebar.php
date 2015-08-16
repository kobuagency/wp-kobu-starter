<?php
/**
 * The sidebar containing the main widget area.
 *
 * @package mywptheme
 */

if ( is_active_sidebar( 'primary' ) ) : ?>
	<aside id="secondary" class="sidebar-container" role="complementary">
		<div class="sidebar-inner">
			<div class="widget-area">
				<?php dynamic_sidebar('primary'); ?>
			</div>
		</div>
	</aside><!-- #secondary -->
<?php endif; ?>