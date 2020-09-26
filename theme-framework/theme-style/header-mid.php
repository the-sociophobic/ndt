<?php 
/**
 * @package 	WordPress
 * @subpackage 	Theater
 * @version		1.0.5
 * 
 * Header Middle Template
 * Created by CMSMasters
 * 
 */


$cmsmasters_option = theater_get_global_options();

$image_id = get_post_meta(get_the_ID(), 'logo_alternative_page', true);
if ($image_id) {
  $logo_alternative = wp_get_attachment_image_src($image_id, 'full');
}
$logo_alternative_page = $logo_alternative[0];


echo '<div class="header_mid" data-height="' . esc_attr($cmsmasters_option['theater' . '_header_mid_height']) . '">' . 
	'<div class="header_mid_outer">' . 
		'<div class="header_mid_inner">';
			do_action('cmsmasters_before_header_mid', $cmsmasters_option);
			
			do_action('cmsmasters_before_logo', $cmsmasters_option);
			echo '<div class="logo_wrap">';

			if($logo_alternative_page == '') {
				theater_logo();
			} else {
				echo 
				'<a href="' . ((is_front_page()) ? 'javascript:;' : esc_url(home_url('/'))) . '" title="' . esc_attr(get_bloginfo('name')) . '" class="logo">' . "\n\t" . 
				'<img src="' . $logo_alternative_page . '" alt="' . esc_attr(get_bloginfo('name')) . '" />' . "\n\t" . 
				'<img class="logo_retina" src="' . $logo_alternative_page . '" alt="' . esc_attr(get_bloginfo('name')) . '" width="' . $logo_width . '" height="' . $logo_height . '" />' . "\r" . 
				'</a>';
			}
				
				
				
			echo '</div>';
			do_action('cmsmasters_after_logo', $cmsmasters_option);
			
			
			echo '<div class="resp_mid_nav_wrap">' . 
				'<div class="resp_mid_nav_outer">' . 
					'<a class="responsive_nav resp_mid_nav" href="' . esc_js("javascript:void(0)") . '"><span></span></a>' . 
				'</div>' . 
			'</div>';
			
			
			if (
				$cmsmasters_option['theater' . '_header_styles'] != 'c_nav'
			) { 
				if (
					$cmsmasters_option['theater' . '_header_add_cont'] == 'cust_html' && 
					$cmsmasters_option['theater' . '_header_add_cont_cust_html'] !== ''
				) {
				echo '<div class="slogan_wrap">' . 
					'<div class="slogan_wrap_inner">' . 
						'<div class="slogan_wrap_text">' . 
							stripslashes($cmsmasters_option['theater' . '_header_add_cont_cust_html']) . 
						'</div>' . 
					'</div>' . 
				'</div>';
				} elseif (
					$cmsmasters_option['theater' . '_header_add_cont'] == 'social' && 
					isset($cmsmasters_option['theater' . '_social_icons'])
				) {
					//theater_social_icons();
					echo '<div class="social_wrap">
						<div class="social_wrap_inner">
							<ul>
									<li>
										<a href="https://vk.com/nebdt" class="cmsmasters_social_icon cmsmasters_social_icon_1 cmsmasters-icon-vkontakte-1" title="" target="_blank"></a>
									</li>
									<li>
										<a href="https://www.facebook.com/nebdt/" class="cmsmasters_social_icon cmsmasters_social_icon_2 cmsmasters-icon-facebook-squared" title="" target="_blank"></a>
									</li>
									<li>
										<a href="https://www.instagram.com/nebdt/" class="cmsmasters_social_icon cmsmasters_social_icon_3 cmsmasters-icon-instagram" title="" target="_blank"></a>
									</li>
							</ul>
						</div>
					</div>';
				}
			}
			
			
			if (
				$cmsmasters_option['theater' . '_header_search'] && 
				$cmsmasters_option['theater' . '_header_styles'] != 'c_nav'
			) {
				echo '<div class="mid_search_but_wrap">' . 
					'<a href="' . esc_js("javascript:void(0)") . '" class="mid_search_but cmsmasters_header_search_but cmsmasters_theme_icon_search"></a>' . 
				'</div>';
			}
			
			
			if ($cmsmasters_option['theater' . '_header_styles'] != 'c_nav') {
				do_action('cmsmasters_after_header_mid_search', $cmsmasters_option);
			}
			
			
			if (
				$cmsmasters_option['theater' . '_header_styles'] == 'default' || 
				$cmsmasters_option['theater' . '_header_styles'] == 'fullwidth'
			) {
				echo '<!-- Start Navigation -->' . 
				'<div class="mid_nav_wrap">' . 
					'<nav>';
						
						$nav_args = array( 
							'theme_location' => 	'primary', 
							'menu_id' => 			'navigation', 
							'menu_class' => 		'mid_nav navigation', 
							'link_before' => 		'<span class="nav_item_wrap">', 
							'link_after' => 		'</span>', 
							'fallback_cb' => 		'theater_fallback_menu' 
						);
						
						
						if (class_exists('Walker_Cmsmasters_Nav_Mega_Menu')) {
							$nav_args['walker'] = new Walker_Cmsmasters_Nav_Mega_Menu();
						}
						
						
						wp_nav_menu($nav_args);
						
					echo '</nav>' . 
				'</div>' . 
				'<!-- Finish Navigation -->';
			}
			
			
			do_action('cmsmasters_after_header_mid', $cmsmasters_option);
		echo '</div>' . 
	'</div>' . 
'</div>';

