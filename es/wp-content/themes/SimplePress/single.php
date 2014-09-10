<?php get_header(); ?>
    <div id="content">
        <div class="content_wrap">
            <div class="content_wrap">
                <div id="posts">
                <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
                    <div id="breadcrumbs">
                        <?php get_template_part('includes/breadcrumbs'); ?>
                    </div>
                    <?php if (get_option('simplepress_integration_single_top') <> '' && get_option('simplepress_integrate_singletop_enable') == 'on') echo(get_option('simplepress_integration_single_top')); ?>

                    <?php
                     $gallery_cat = get_option('simplepress_gallery');
                     if(in_category($gallery_cat) && get_option('simplepress_gallery_enable') == "on") { get_template_part('includes/single_gallery'); }
                    else { get_template_part('includes/single_blog'); }  ?>

                    <?php if (get_option('simplepress_show_postcomments') == 'on') comments_template('', true); ?>
                <?php endwhile; endif; ?>
                </div><!-- #posts -->
                <?php get_sidebar(); ?>
            </div><!-- .content_wrap -->
        </div><!-- .content_wrap -->
    </div><!-- #content -->
</div><!-- .wrapper -->
<?php get_footer(); ?>