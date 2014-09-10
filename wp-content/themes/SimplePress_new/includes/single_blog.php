<?php $thumb = '';
$width = 182;
$height = 182;
$classtext = '';
$titletext = get_the_title();
$thumbnail = get_thumbnail($width,$height,$classtext,$titletext,$titletext);
$thumb = $thumbnail["thumb"]; ?>
<div class="post">
	<?php if ($thumb <> '' && get_option('simplepress_thumbnails') == 'on') { ?>
	<div class="thumb">
		<div>
			<span class="image" style="background-image: url(<?php print_thumbnail($thumb, $thumbnail["use_timthumb"], $titletext, $width, $height, $classtext, true, true); ?>);">
			   <img src="<?php bloginfo('template_directory'); ?>/images/thumb-overlay.png" alt="" />
			</span>
		</div>
		<span class="shadow"></span>
	</div>
	<?php }; ?>
	
	<div class="text <?php if ($thumb == '' || get_option('simplepress_thumbnails') == 'false') print "no_thumb" ?>">
		<h2><?php the_title(); ?></h2>
		<span class="postinfo">
			<span class="line"></span>
			<?php get_template_part('includes/postinfo'); ?>
			<span class="line"></span>
		</span>
		</div>
			<?php the_content(''); ?>
		<br class="clear" />
		<?php edit_post_link(esc_html__('Edit this page','SimplePress')); ?>
		<?php if (get_option('simplepress_integration_single_bottom') <> '' && get_option('simplepress_integrate_singlebottom_enable') == 'on') echo(get_option('simplepress_integration_single_bottom')); ?>
		<?php if (get_option('simplepress_468_enable') == 'on') { ?>
		<?php if(get_option('simplepress_468_adsense') <> '') echo(get_option('simplepress_468_adsense'));
			else { ?>
		<a href="<?php echo esc_url(get_option('simplepress_468_url')); ?>"><img src="<?php echo esc_url(get_option('simplepress_468_image')); ?>" alt="468 ad" class="foursixeight" /></a>
	<?php } ?>	
<?php } ?>
</div><!-- .post -->  