 <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<?php $thumb = '';
	$width = 182;
	$height = 182;
	$classtext = '';
	$titletext = get_the_title();
	$thumbnail = get_thumbnail($width,$height,$classtext,$titletext,$titletext,true);
	$thumb = $thumbnail["thumb"];
	?>
	<div class="post gallery_item">
		<div class="thumb">
			<div>
				<span class="image" style="background-image: url(<?php print_thumbnail($thumb, $thumbnail["use_timthumb"], $titletext, $width, $height, $classtext, true, true); ?>);">
					<a class="lightbox fancybox" href="<?php echo esc_url($thumbnail['fullpath']); ?>" rel="gallery" title="<?php the_title(); ?>"><img src="<?php bloginfo('template_directory'); ?>/images/thumb-overlay.png" alt="" /></a>
				</span>
			</div>
			<span class="shadow"></span>
			<span class="readmore"><a href="<?php the_permalink(); ?>"><?php esc_html_e('read more','SimplePress'); ?></a></span>
		</div>
	</div><!-- .post -->
<?php endwhile; ?>
	<br class="clear"  />
	<div class="entry page-nav clearfix">
		<?php if(function_exists('wp_pagenavi')) { wp_pagenavi(); }
		else { ?>
			 <?php get_template_part('includes/navigation'); ?>
		<?php } ?>
	</div> <!-- end .entry -->
<?php else : ?>
	<?php get_template_part('includes/no-results'); ?>
<?php endif; ?>