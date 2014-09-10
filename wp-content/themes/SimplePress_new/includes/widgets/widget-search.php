<?php class ETSearchWidget extends WP_Widget
{
    function ETSearchWidget(){
		$widget_ops = array('description' => 'Display custom search field.');
		parent::WP_Widget(false,$name='ET Search',$widget_ops);
    }

  /* Displays the Widget in the front-end */
    function widget($args, $instance){
?>	
	<div class="widget">
        <div id="search-bar"> 
            <form method="get" id="searchform1" action="<?php echo esc_url( home_url() ); ?>"> 
                <input type="text" value="" name="s" id="searchinput" /> 

                <input type="image" src="<?php bloginfo('template_directory'); ?>/images/search-submit.png" id="searchsubmit" /> 
            </form> 
        </div> <!-- #search-bar --> 
     </div>
<?php
		echo $after_widget;
	}

}// end ETSearchWidget class

function ETSearchWidgetInit() {
  register_widget('ETSearchWidget');
}

add_action('widgets_init', 'ETSearchWidgetInit');

?>