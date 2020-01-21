<?php
/**
 * The footer for our theme.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package mywptheme
 */
?>

		</div> <!-- dtc -->
		</div><!-- #main-content -->

		<div id="footer-wrap">
			<div class="dtc align-middle">
				<footer id="footer">
					<div id="copyright" role="contentinfo" class="clr">&copy; <?php echo date('Y'); ?> <?php bloginfo( 'name' ); ?>.</div><!-- #copyright -->
					<div id="developedby"><?php _e('developed by')?> <a href="http://www.kobu.pt" target="_blank"></a></div>
				</footer>
			</div>
		</div> <!-- footer-wrap -->

	</div> <!-- tablesite-content -->

<?php echo kobu_footer_scripts(); ?>
<?php wp_footer(); ?>

</body>
</html>
