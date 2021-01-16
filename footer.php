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
				<div id="copyright">&copy; <?php echo date('Y'); ?> <?php bloginfo( 'name' ); ?>.</div><!-- #copyright -->
				<div id="developedby"><?php _e('made by', 'kobu')?> <a href="https://kobu.agency/" target="_blank">kobu</a></div>
			</footer>
		</div> <!-- footer-wrap -->

	</div> <!-- tablesite-content -->

<?php echo kobu_footer_scripts(); ?>
<?php wp_footer(); ?>

</body>
</html>
