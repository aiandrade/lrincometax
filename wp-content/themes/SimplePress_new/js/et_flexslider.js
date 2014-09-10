(function($){
	var $featured = $('#featured'),
		$controllers = $('#featured #switcher'),
		$et_mobile_nav_button = $('#mobile_nav'),
		$et_nav = $('ul.nav'),
		et_container_width = $('.wrapper').width(),
		et_featured_slider_auto, et_featured_auto_speed, $cloned_nav,
		et_slider;
	
	$(document).ready(function(){
		var et_slider_settings;
		
		$("#posts .post").fitVids();
	
		if ( $featured.length ){
			$('div.slide .description').css({'visibility':'hidden','opacity':'0','display':'block'});
			
			et_slider_settings = {
				slideshow: false,
				before: function(slider){
					$controllers.find('div.item').eq( slider.currentSlide ).find('.wrap').animate( { 'marginTop' : 0 }, 500 );
					$controllers.find('div.item').eq( slider.animatingTo ).find('.wrap').animate( { 'marginTop' : '-15px' }, 500 );
					
					$featured.find('li.slide').eq( slider.currentSlide ).find('.banner').animate( { opacity : 0 }, 500 );
					$featured.find('li.slide').eq( slider.animatingTo ).find('.banner').css( { 'top' : 0 } ).animate( { opacity : 1, 'top' : '90px' }, 500 );
				},
				start: function(slider) {
					et_slider = slider;
				}
			}

			if ( $featured.hasClass('et_slider_auto') ) {
				var et_slider_autospeed_class_value = /et_slider_speed_(\d+)/g;
				
				et_slider_settings.slideshow = true;
				
				et_slider_autospeed = et_slider_autospeed_class_value.exec( $featured.attr('class') );
				
				et_slider_settings.slideshowSpeed = et_slider_autospeed[1];
			}
			
			et_slider_settings.pauseOnHover = true;
			
			$featured.flexslider( et_slider_settings );
		}
		
		$et_nav.clone().attr('id','mobile_menu').removeClass().appendTo( $et_mobile_nav_button );
		$cloned_nav = $et_mobile_nav_button.find('> ul');
		
		$et_mobile_nav_button.click( function(){
			if ( $(this).hasClass('closed') ){
				$(this).removeClass( 'closed' ).addClass( 'opened' );
				$cloned_nav.slideDown( 500 );
			} else {
				$(this).removeClass( 'opened' ).addClass( 'closed' );
				$cloned_nav.slideUp( 500 );
			}
			return false;
		} );
		
		$et_mobile_nav_button.find('a').click( function(event){
			event.stopPropagation();
		} );
		
		$(window).resize( function(){
			if ( et_container_width != $('.wrapper').width() ) { 
				et_container_width = $('.wrapper').width();
			}
		});
	});
	
	$(window).load(function(){
		var $flexcontrol = $('#featured .flex-control-nav');
		
		$controllers.find('div.item').click( function(){
			var $this_control = $(this),
				order = $this_control.prevAll('div').length;
			
			if ( $this_control.hasClass('active-slide') ) return;
			
			et_slider.flexAnimate( order, et_slider.vars.pauseOnAction );

			return false;
		} );
	});
})(jQuery)