<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<?php $thumb = '';
	$width = 182;
	$height = 182;
	$classtext = '';
	$titletext = get_the_title();
	$thumbnail = get_thumbnail($width,$height,$classtext,$titletext,$titletext);
	$thumb = $thumbnail["thumb"];
	?>
	<div class="post">
		<?php if ($thumb <> '' && get_option('simplepress_thumbnails_index') == 'on') { ?>
		<div class="thumb">
			<div>
				<span class="image" style="background-image: url(<?php print_thumbnail($thumb, $thumbnail["use_timthumb"], $titletext, $width, $height, $classtext, true, true); ?>);">
					<a href="<?php the_permalink(); ?>"><img src="<?php echo get_template_directory_uri(); ?>/images/thumb-overlay.png" alt="" /></a>
				</span>
			</div>
			<span class="shadow"></span>
		</div>
		<?php }; ?>
		<div class="text <?php if ($thumb == '' || get_option('simplepress_thumbnails_index') == 'false') print "no_thumb" ?>">
			<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
			<span class="postinfo">
				<span class="line"></span>
				<?php get_template_part('includes/postinfo'); ?>
				<span class="line"></span>
			</span>
			<?php if (get_option('simplepress_blog_style') == 'false') { ?>
			<?php truncate_post(400);?>
			<br class="clear" />
			<span class="readmore"><a href="<?php the_permalink(); ?>"><?php esc_html_e('read more','SimplePress'); ?></a></span>
			<?php }; ?>
		</div>
		<?php if (get_option('simplepress_blog_style') == 'on') { ?>
		<?php the_content(''); ?>
		<br class="clear" />
		<span class="readmore"><a href="<?php the_permalink(); ?>"><?php esc_html_e('read more','SimplePress'); ?></a></span>
		<?php }; ?>
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