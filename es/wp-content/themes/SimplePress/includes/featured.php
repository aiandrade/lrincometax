<?php
	$arr = array();
	$responsive = 'on' != get_option('simplepress_responsive_layout') ? false : true;
	$featured_auto_class = '';
	if ( 'on' == get_option('simplepress_slider_auto') ) $featured_auto_class .= ' et_slider_auto et_slider_speed_' . get_option('simplepress_slider_autospeed');
	$i=1;

	$width = 954;
	$height = 375;
	$width_small = 83;
	$height_small = 83;

	$featured_cat = get_option('simplepress_feat_cat');
	$featured_num = (int) get_option('simplepress_featured_num');

	if (get_option('simplepress_use_pages') == 'false') query_posts("posts_per_page=$featured_num&cat=".get_catId($featured_cat));
	else {
		global $pages_number;

		if (get_option('simplepress_feat_pages') <> '') $featured_num = count(get_option('simplepress_feat_pages'));
		else $featured_num = $pages_number;

		$et_featured_pages_args = array(
			'post_type' => 'page',
			'orderby' => 'menu_order',
			'order' => 'ASC',
			'posts_per_page' => (int) $featured_num,
		);

		if ( is_array( et_get_option( 'simplepress_feat_pages', '', 'page' ) ) )
			$et_featured_pages_args['post__in'] = (array) array_map( 'intval', et_get_option( 'simplepress_feat_pages', '', 'page' ) );

		query_posts( $et_featured_pages_args );
	};

	while (have_posts()) : the_post();
		global $post;
		$arr[$i]["title"] = truncate_title(35,false);
		$arr[$i]["fulltitle"] = truncate_title(35,false);

		$arr[$i]["excerpt"] = truncate_post(400,false);
		$arr[$i]["excerpt_small"] = truncate_post(80,false);

		$arr[$i]["permalink"] = get_permalink();

		$arr[$i]["thumbnail"] = get_thumbnail($width,$height,'',$arr[$i]["fulltitle"],$arr[$i]["fulltitle"]);
		$arr[$i]["thumb"] = $arr[$i]["thumbnail"]["thumb"];

		$arr[$i]["thumbnail_small"] = get_thumbnail($width_small,$height_small,'',$arr[$i]["fulltitle"],$arr[$i]["fulltitle"]);
		$arr[$i]["thumb_small"] = $arr[$i]["thumbnail_small"]["thumb"];

		$arr[$i]["use_timthumb"] = $arr[$i]["thumbnail"]["use_timthumb"];

		$arr[$i]['post_id'] = (int) get_the_ID();

		$i++;
	endwhile; wp_reset_query();	?>

  <div id="featured" class="<?php if ( $responsive ) echo esc_attr( 'flexslider' . $featured_auto_class ); else echo 'et_default_slider'; ?>">
   	<?php if ( $responsive ) { ?>
		<ul class="slides">
	<?php } else { ?>
		<div id="slides">
	<?php } ?>
    	<?php for ($i = 1; $i <= $featured_num; $i++) { ?>
        <?php if ( $responsive ) { ?>
			<li class="slide">
		<?php } else { ?>
			<div class="slide <?php if($i == 1) echo('active'); ?>">
		<?php } ?>
            <div class="slider_image">
				<a href="<?php echo esc_url( $arr[$i]["permalink"] ); ?>">
				<?php
					print_thumbnail( array(
						'thumbnail' 	=> $arr[$i]["thumbnail"]["thumb"],
						'use_timthumb' 	=> $arr[$i]["thumbnail"]["use_timthumb"],
						'alttext'		=> $arr[$i]["fulltitle"],
						'width'			=> (int) $width,
						'height'		=> (int) $height,
						'et_post_id'	=> $arr[$i]['post_id'],
					) );
				?>
					<span class="slider_overlay"></span>
				</a>
			</div>
            <div class="banner">
            <h2><?php echo esc_html($arr[$i]["title"]); ?></h2>
            <?php echo($arr[$i]["excerpt"]); ?>
            <br class="clear" />
            <span><a href="<?php echo esc_url($arr[$i]["permalink"]); ?>"><?php esc_html_e('read more','SimplePress'); ?></a></span>
            </div>
        <?php if ( $responsive ) { ?>
			</li> <!-- end .slide -->
		<?php } else { ?>
			</div> <!-- end .slide -->
		<?php } ?>
        <?php }; ?>
    <?php if ( $responsive ) { ?>
		</ul> <!-- end .slides -->
	<?php } else { ?>
		</div> <!-- end #slides -->
	<?php } ?>
      <span class="slider_shadow"></span>
      <div id="switcher">
      	  <?php for ($i = 1; $i <= $featured_num; $i++) { ?>
       	  <div class="item">
              <div class="wrap <?php if($i == 1) echo('active'); ?>">
               	<span class="image">
				<?php
					print_thumbnail( array(
						'thumbnail' 	=> $arr[$i]["thumb_small"],
						'use_timthumb' 	=> $arr[$i]["thumbnail"]["use_timthumb"],
						'alttext'		=> $arr[$i]["fulltitle"],
						'width'			=> (int) $width_small,
						'height'		=> (int) $height_small,
						'et_post_id'	=> $arr[$i]['post_id'],
					) );
				?>
					<span class="slider_small_overlay"></span>
				</span>
                  <div class="hover">
                      <span><?php echo esc_html($arr[$i]["fulltitle"]); ?></span>
                      <br class="clear" />
                      <?php echo($arr[$i]["excerpt_small"]); ?>
                  </div>
              </div>
          </div>
          <?php }; ?>
      </div><!-- #switcher -->
    </div><!-- end #featured -->