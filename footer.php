<?php
/**
 * The footer for our theme.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package mywptheme
 */
?>
</div><!-- #main-content -->

<div id="footer-wrap">
	<footer id="footer">
		<div class="footer-container">
			<?php if (has_nav_menu('footer')) : ?>
				<div class="footer-menu-wrapper">
					<nav class="footer-menu-navigation" role="navigation">
						<?php wp_nav_menu(array(
							'theme_location'	=> 'footer',
							'sort_column'	=> 'menu_order',
							'menu_class'	=> 'footer-menu',
							'fallback_cb'	=> false,
							'walker'		=> new Kobu_Dropdown_Walker_Nav_Menu()
						)); ?>
					</nav>
				</div>
			<?php endif; ?>
		</div>

		<div class="copyright-section">
			<div class="footer-container">
				<div class="left-section">
					<div class="copyright">&copy; Copyright <?php echo date('Y'); ?> <?php bloginfo('name'); ?></div>
					<div class="developedby"><?php _e('made by', 'kobu') ?> <a href="https://kobu.agency/" target="_blank" rel=”noopener”>kobu</a></div>
				</div>
			</div>
		</div>
	</footer>
</div> <!-- footer-wrap -->

</div> <!-- tablesite-content -->

<?php echo kobu_footer_scripts(); ?>
<?php wp_footer(); ?>

</body>

</html>