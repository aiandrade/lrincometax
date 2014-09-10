<?php 
/*
Template Name: Search Page
*/
?>
<?php 
	$et_ptemplate_settings = array();
	$et_ptemplate_settings = maybe_unserialize( get_post_meta($post->ID,'et_ptemplate_settings',true) );
	
	$fullwidth = isset( $et_ptemplate_settings['et_fullwidthpage'] ) ? (bool) $et_ptemplate_settings['et_fullwidthpage'] : false;
?>

<?php get_header(); ?>
	<div id="content<?php if($fullwidth) echo(' full');?>">
    	<div class="content_wrap<?php if($fullwidth) echo(' full');?>">
            <div class="content_wrap<?php if($fullwidth) echo(' full');?>">
            	<div id="posts<?php if($fullwidth) echo(' post_full');?>">
				<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
					<?php if (get_option('simplepress_integration_single_top') <> '' && get_option('simplepress_integrate_singletop_enable') == 'on') echo(get_option('simplepress_integration_single_top')); ?>
					<?php $thumb = '';
                    $width = 182;
                    $height = 182;
                    $classtext = '';
                    $titletext = get_the_title();
                    $thumbnail = get_thumbnail($width,$height,$classtext,$titletext,$titletext);
                    $thumb = $thumbnail["thumb"]; ?>
                    <h2 style="margin-top: 20px;"><?php the_title(); ?></h2>
                    <br class="clear" />
                    <div class="post<?php if($fullwidth) echo(' post_full');?>">
                        <?php if ($thumb <> '' && get_option('simplepress_page_thumbnails') == 'on') { ?>
                        <div class="thumb">
                            <div>
                                <span class="image" style="background-image: url(<?php print_thumbnail($thumb, $thumbnail["use_timthumb"], $titletext, $width, $height, $classtext, true, true); ?>);">
                                    <img src="<?php bloginfo('template_directory'); ?>/images/thumb-overlay.png" alt="" />
                                </span>
                            </div>
                            <span class="shadow"></span>
                        </div>
                        <?php }; ?>
                                <?php the_content(''); ?>
                            <br class="clear" />
							
							<div id="et-search">
								<div id="et-search-inner" class="clearfix">
									<p id="et-search-title"><span><?php esc_html_e('search this website','SimplePress'); ?></span></p>
									<form action="<?php echo home_url(); ?>" method="get" id="et_search_form">
										<div id="et-search-left">
											<p id="et-search-word"><input type="text" id="et-searchinput" name="s" value="<?php esc_attr_e('search this site...','SimplePress'); ?>" /></p>
																			
											<p id="et_choose_posts"><label><input type="checkbox" id="et-inc-posts" name="et-inc-posts" /> <?php esc_html_e('Posts','SimplePress'); ?></label></p>
											<p id="et_choose_pages"><label><input type="checkbox" id="et-inc-pages" name="et-inc-pages" /> <?php esc_html_e('Pages','SimplePress'); ?></label></p>
											<p id="et_choose_date">
												<select id="et-month-choice" name="et-month-choice">
													<option value="no-choice"><?php esc_html_e('Select a month','SimplePress'); ?></option>
													<?php 
														global $wpdb, $wp_locale;
														
														$selected = '';
														$query = "SELECT YEAR(post_date) AS `year`, MONTH(post_date) AS `month`, count(ID) as posts FROM $wpdb->posts GROUP BY YEAR(post_date), MONTH(post_date) ORDER BY post_date DESC";
														
														$arcresults = $wpdb->get_results($query);
																															
														foreach ( (array) $arcresults as $arcresult ) {
															if ( isset($_POST['et-month-choice']) && ( $_POST['et-month-choice'] == ($arcresult->year . $arcresult->month) ) ) {
																$selected = ' selected="selected"';
															}
															echo "<option value='{$arcresult->year}{$arcresult->month}'{$selected}>{$wp_locale->get_month($arcresult->month)}" . ", {$arcresult->year}</option>";
															if ( $selected <> '' ) $selected = '';
														}
													?>
												</select>
											</p>
										
											<p id="et_choose_cat"><?php wp_dropdown_categories('show_option_all=Choose a Category&show_count=1&hierarchical=1&id=et-cat&name=et-cat'); ?></p>
										</div> <!-- #et-search-left -->
										
										<div id="et-search-right">
											<input type="hidden" name="et_searchform_submit" value="et_search_proccess" />
											<input class="et_search_submit" type="submit" value="<?php esc_attr_e('Submit','SimplePress'); ?>" id="et_search_submit" />
										</div> <!-- #et-search-right -->
									</form>
								</div> <!-- end #et-search-inner -->
							</div> <!-- end #et-search -->
							
							<div class="clear"></div>
							
                            <?php edit_post_link(esc_html__('Edit this page','SimplePress')); ?>
                    <?php if (get_option('simplepress_integration_single_bottom') <> '' && get_option('simplepress_integrate_singlebottom_enable') == 'on') echo(get_option('simplepress_integration_single_bottom')); ?>
                    <?php if (get_option('simplepress_468_enable') == 'on') { ?>
                        <?php if(get_option('simplepress_468_adsense') <> '') echo(get_option('simplepress_468_adsense'));
                        else { ?>
                            <a href="<?php echo esc_url(get_option('simplepress_468_url')); ?>"><img src="<?php echo esc_url(get_option('simplepress_468_image')); ?>" alt="468 ad" class="foursixeight" /></a>
                        <?php } ?>	
                    <?php } ?>
                    </div><!-- .post -->
				<?php endwhile; endif; ?>
				</div><!-- #posts -->  
				<?php if (!$fullwidth) get_sidebar(); ?>
			</div><!-- .content_wrap --> 
        </div><!-- .content_wrap --> 
    </div><!-- #content --> 
</div><!-- .wrapper --> 
<?php get_footer(); ?>