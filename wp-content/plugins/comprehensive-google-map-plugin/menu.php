<?php
/*
Copyright (C) 2011  Alexander Zagniotov

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

if ( !function_exists('cgmp_google_map_plugin_menu') ):
      function cgmp_google_map_plugin_menu() {
      		$hook = add_menu_page("Comprehensive Google Map", 'Google Map', 'activate_plugins', CGMP_HOOK, 'cgmp_parse_menu_html', CGMP_PLUGIN_IMAGES .'/google_map.png');
	  		add_action('admin_print_scripts-'.$hook, 'cgmp_google_map_tab_script');
			$hook = add_submenu_page(CGMP_HOOK, 'Shortcode Builder', 'Shortcode Builder', 'activate_plugins', 'cgmp-shortcodebuilder', 'cgmp_shortcodebuilder_callback' );
			add_action('admin_print_scripts-'.$hook, 'cgmp_google_map_tab_script');
			$hook = add_submenu_page(CGMP_HOOK, 'Settings', 'Settings', 'activate_plugins', 'cgmp-settings', 'cgmp_settings_callback' );
		   	add_action('admin_print_scripts-'.$hook, 'cgmp_google_map_tab_script');
	  }
endif;

if ( !function_exists('cgmp_settings_callback') ):

	function cgmp_settings_callback() {

		if (!current_user_can('activate_plugins'))  {
             	wp_die( __('You do not have sufficient permissions to access this page.') );
		}

		if (isset($_POST['cgmp-save-settings']))  {
		   update_option(CGMP_DB_SETTINGS_BUILDER_LOCATION, $_POST['builder-under-post']);
			update_option(CGMP_DB_SETTINGS_CUSTOM_POST_TYPES, $_POST['custom-post-types']);	
         cgmp_show_message("Settings updated successfully!");
		}

      $template_values = array();
      $template_values = populate_token_builder_under_post($template_values);
      $template_values = populate_token_custom_post_types($template_values);
      echo cgmp_render_template_with_values($template_values, CGMP_HTML_TEMPLATE_PLUGIN_SETTINGS_PAGE);
	}

endif;

function populate_token_builder_under_post($template_values) {
   $setting_builder_location = get_option(CGMP_DB_SETTINGS_BUILDER_LOCATION);                                        
   $yes_display_radio_btn = "";                                                                                      
   $no_display_radio_btn = "checked='checked'";                                                                      
   if (isset($setting_builder_location) && $setting_builder_location == "true") {                                    
      $no_display_radio_btn = "";                                                                                    
      $yes_display_radio_btn = "checked='checked'";                                                                  
   }                                                                                                                 
   $template_values["YES_DISPLAY_SHORTCODE_BUILDER_INPOST_TOKEN"] = $yes_display_radio_btn;                        
   $template_values["NO_DISPLAY_SHORTCODE_BUILDER_INPOST_TOKEN"] = $no_display_radio_btn;                            
   return $template_values;
}

function populate_token_custom_post_types($template_values) {                                                                          
   $custom_post_types = get_option(CGMP_DB_SETTINGS_CUSTOM_POST_TYPES);                                           
   $template_values["CUSTOM_POST_TYPES_TOKEN"] = $custom_post_types;                             
   return $template_values;                 
} 

if ( !function_exists('cgmp_shortcodebuilder_callback') ):

	function cgmp_shortcodebuilder_callback() {

		if (!current_user_can('activate_plugins'))  {
             	wp_die( __('You do not have sufficient permissions to access this page.') );
        }

		include_once(CGMP_PLUGIN_INCLUDE_DIR.'/shortcode_builder_form.php');
		echo cgmp_render_template_with_values(array("SHORTCODEBUILDER_TOKEN" => $map_configuration_template), CGMP_HTML_TEMPLATE_MAP_SHORTCODE_BUILDER_PAGE);
	}
endif;


if ( !function_exists('cgmp_parse_menu_html') ):
function cgmp_parse_menu_html() {
      if (!current_user_can('activate_plugins'))  {
                wp_die( __('You do not have sufficient permissions to access this page.') );
        }

		$json_html_doco_params = cgmp_fetch_json_data_file(CGMP_JSON_DATA_HTML_ELEMENTS_DOCO_PARAMS);

		if (is_array($json_html_doco_params)) {
			$map_configuration_form_template = cgmp_render_template_with_values($json_html_doco_params, CGMP_HTML_TEMPLATE_MAP_CONFIGURATION_FORM);
			$template_values = array();
        	$template_values["DOCUMENTATION_TOKEN"] = $map_configuration_form_template;

        	echo cgmp_render_template_with_values($template_values, CGMP_HTML_TEMPLATE_MAP_CONFIG_DOCUMENTATION_PAGE);
		}
}
endif;

?>
