<?php get_header(); ?>
	<?php if (get_option('simplepress_featured') == 'on') get_template_part('includes/featured'); ?>
	<?php if (get_option('simplepress_quote') == 'on' && get_option('simplepress_blog_style') == 'false') { ?>
		<div id="quote">
			<div>
				<?php echo (get_option('simplepress_quote_one')); ?>
				<br class="clear" />
			  <span><?php echo (get_option('simplepress_quote_two')); ?></span>
			</div>
		</div>
    <?php }; ?>
    <?php if (get_option('simplepress_blog_style') == 'on') { ?>
		<div id="content" style="margin-top: 40px;">
			<div class="content_wrap">
				<div class="content_wrap">
					<div id="posts">			
						<?php get_template_part('includes/entry'); ?>
					</div><!-- #posts -->  
					<?php $gallery_cat = get_option('simplepress_gallery');
					if(is_category($gallery_cat)) { } else { get_sidebar(); }; ?>
				</div><!-- .content_wrap --> 
			</div><!-- .content_wrap --> 
		</div><!-- #content --> 
	<?php }; ?>
</div><!-- .wrapper --> 
<?php if (get_option('simplepress_blog_style') == 'false') { ?>
<div id="strip-top"></div>
<div id="strip">
  <div> <?php echo (get_option('simplepress_strip')); ?>
      <img class="arrow" src="<?php bloginfo('template_directory'); ?>/images/strip-arrow.png" alt="" />
  </div>
</div>
<div class="wrapper">
    <div id="blurbs">
		<?php for ($i = 1; $i <= 3; $i++) { ?>
		<?php query_posts('page_id=' . get_pageId(html_entity_decode(get_option('simplepress_service_'.$i)))); while (have_posts()) : the_post(); ?>
        <?php $icon = '';
						$icon = get_post_meta($post->ID, 'Icon', true);
						$tagline = '';
						$tagline = get_post_meta($post->ID, 'Tagline', true); ?>
        <div <?php if ($icon <> '') { ?>style="background-image: url(<?php echo esc_url($icon); ?>);"<?php }; ?>>
            <span class="titles"><?php the_title(); ?></span>
            <?php global $more;   
						$more = 0;
						the_content(""); ?>
            <br class="clear" />
            <span class="readmore"><a href="<?php the_permalink(); ?>"><?php esc_html_e('read more','SimplePress'); ?></a></span>
        </div>
        <?php endwhile; wp_reset_query(); ?>
		<?php }; ?>

        <br class="clear" />
    </div>
    <span class="blurbs_shadow"></span>
</div>
<?php }; ?>
<?php get_footer(); ?>	