<?php $gallery_cat = get_option('simplepress_gallery');
if (is_category()) $post_number = get_option('simplepress_catnum_posts');
if (is_category($gallery_cat)) $post_number = get_option('simplepress_gallery_posts'); ?>
<?php get_header(); ?>
	<div id="content<?php if (is_category($gallery_cat) && get_option('simplepress_gallery_enable') == "on") echo " full" ?>">
    	<div class="content_wrap<?php if (is_category($gallery_cat) && get_option('simplepress_gallery_enable') == "on") echo " full" ?>">
            <div class="content_wrap<?php if (is_category($gallery_cat) && get_option('simplepress_gallery_enable') == "on") echo " full" ?>">
            	<div id="posts" <?php if (is_category($gallery_cat) && get_option('simplepress_gallery_enable') == "on") echo " style='width: 960px;' class='et_gallery_category'" ?>>
                    <div id="breadcrumbs">
                        <?php get_template_part('includes/breadcrumbs'); ?>
                    </div>
                    <br class="clear"  />
					
					<?php if(is_category($gallery_cat) && get_option('simplepress_gallery_enable') == "on") { get_template_part('includes/gallery'); }
					else { get_template_part('includes/entry'); }  ?>
                </div><!-- #posts -->  
				<?php if(is_category($gallery_cat)) { } else { get_sidebar(); }; ?>
            </div><!-- .content_wrap --> 
        </div><!-- .content_wrap --> 
    </div><!-- #content --> 
</div><!-- .wrapper --> 
<?php get_footer(); ?>