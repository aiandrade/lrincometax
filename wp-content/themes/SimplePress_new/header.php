<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head profile="http://gmpg.org/xfn/11">
<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
<title><?php elegant_titles(); ?></title>
<?php elegant_description(); ?>
<?php elegant_keywords(); ?>
<?php elegant_canonical(); ?>

<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
<link rel="alternate" type="application/rss+xml" title="<?php bloginfo('name'); ?> RSS Feed" href="<?php bloginfo('rss2_url'); ?>" />
<link rel="alternate" type="application/atom+xml" title="<?php bloginfo('name'); ?> Atom Feed" href="<?php bloginfo('atom_url'); ?>" />
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
<?php if ( is_singular() ) wp_enqueue_script( 'comment-reply' ); ?>
<script type="text/javascript">
	document.documentElement.className = 'js';
</script>
<?php wp_head(); ?>
<!--[if lt IE 7]>
    <link rel="stylesheet" type="text/css" href="<?php bloginfo('template_directory'); ?>/css/ie6style.css" />
    <script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/DD_belatedPNG_0.0.8a-min.js"></script>
    <script type="text/javascript">DD_belatedPNG.fix('img#logo, .slider_image img, .banner, .banner .readmore, .wrap .image img, .thumb div .image img, div.avatar span.overlay');</script>
<![endif]--> 
<!--[if IE 7]>
    <link rel="stylesheet" type="text/css" href="<?php bloginfo('template_directory'); ?>/css/ie7style.css" />
<![endif]--> 
</head>
<body <?php body_class(); ?>>
<div class="wrapper">

	<a title="Spanish Version" href="http://www.lrincometaxservice.com/es"><img id="banners" alt="mex-small" src="http://www.lrincometaxservice.com/wp-content/uploads/2013/05/mex-small.jpg" /></a> 

  <a href="<?php bloginfo('url'); ?>"><?php $logo = (get_option('simplepress_logo') <> '') ? get_option('simplepress_logo') : get_bloginfo('template_directory').'/images/logo.png'; ?>
	<img src="<?php echo esc_url($logo); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>" id="logo"/></a> 
    <div id="navwrap">
        <span class="nav_top"></span>
		<?php $menuClass = 'nav superfish';
        $primaryNav = '';
        if (function_exists('wp_nav_menu')) {
            $primaryNav = wp_nav_menu( array( 'theme_location' => 'primary-menu', 'container' => '', 'fallback_cb' => '', 'menu_class' => $menuClass, 'echo' => false ) ); 
        };
        if ($primaryNav == '') { ?>
            <ul class="<?php echo $menuClass; ?>">
                <?php if (get_option('simplepress_home_link') == 'on') { ?>
                    <li <?php if (is_home()) echo('class="current_page_item"') ?>><a href="<?php bloginfo('url'); ?>"><?php esc_html_e('Home','SimplePress') ?></a></li>
                <?php }; ?>
                
                <?php show_page_menu($menuClass,false,false); ?>
                <?php show_categories_menu($menuClass,false); ?>					
            </ul> <!-- end ul.nav -->
        <?php }
        else echo($primaryNav); ?>
		
		<?php do_action('et_header_menu'); ?>
        
        <?php global $default_colorscheme, $shortname; $colorSchemePath = '';
        $colorScheme = get_option($shortname . '_color_scheme');
        if ($colorScheme <> $default_colorscheme) $colorSchemePath = strtolower($colorScheme) . '/'; ?>
        <br class="clear" />
        <span class="nav_bottom"></span>
    </div><!-- #navwrap --> 