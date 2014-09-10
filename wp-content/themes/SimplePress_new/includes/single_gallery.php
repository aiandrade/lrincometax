<?php $thumb = '';
$width = 182;
$height = 182;
$classtext = '';
$titletext = get_the_title();
$thumbnail = get_thumbnail($width,$height,$classtext,$titletext,$titletext,true);
$thumb = $thumbnail["thumb"]; ?>
<div class="post">

		<h2><?php the_title(); ?></h2>
		<span class="postinfo">
			<span class="line"></span>
			<?php get_template_part('includes/postinfo'); ?>
			<span class="line"></span>
		</span>
        
	<a href="<?php echo $thumbnail['fullpath']; ?>" class="lightbox fancybox" rel="media" title="<?php the_title();?>"><img src="<?php echo esc_url($thumbnail['fullpath']); ?>" class="gallery_full" /></a>
	


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