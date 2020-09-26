<?php
/**
 * @package 	WordPress
 * @subpackage 	Theater Child
 * @version		1.0.0
 * 
 * Child Theme Functions File
 * Created by CMSMasters
 * 
 */

function theater_enqueue_styles() {
    wp_enqueue_style('theater-child-style', get_stylesheet_uri(), array(), '1.0.0', 'screen, print');
    wp_enqueue_style('my-fancybox-style', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.css');
    wp_enqueue_style('theater-bileterapit-style', "https://apit.bileter.ru/css/apit.css");
    wp_enqueue_style('theater-bileternebdt-style', "https://apit.bileter.ru/css/nebdt.ru.css");
}
add_action('wp_enqueue_scripts', 'theater_enqueue_styles', 11);

function theater_enqueue_scripts() {
		wp_enqueue_script( 'parent-scripts', get_stylesheet_directory_uri() . '/child-scripts.js' );
			wp_enqueue_script( 'my-fancybox-scripts', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.js');
    // wp_enqueue_script('theater-bileterjq-script', "http://apit.bileter.ru/js/jquery.js");
    wp_enqueue_script('theater-bileterapi-script', "https://nebdt.apit.bileter.ru/8e665805311706860c2ef141d3dc13e2.js");
}
add_action('wp_enqueue_scripts', 'theater_enqueue_scripts', 11);

function my_myme_types($mime_types){
    $mime_types['svg'] = 'image/svg+xml'; // поддержка SVG
    return $mime_types;
  }
  add_filter('upload_mimes', 'my_myme_types', 1, 1);


function publish_future_posts_immediately($post_id, $post) {
global $wpdb;
if ( $post->post_status == 'future' ) {
$wpdb->update($wpdb->posts, array( 'post_status' => 'publish' ), array( 'ID' => $post_id ));
wp_clear_scheduled_hook('publish_future_post', $post_id);
}
}
add_action('save_post', 'publish_future_posts_immediately', 10, 2);

if ( ! function_exists( 'add_footer_widgets' ) ) {
	add_action( 'widgets_init', 'add_footer_widgets' );

	function add_footer_widgets() {

		register_sidebar(
			array(
				'name'          => __( 'Footer Logo', 'theater' ),
				'id'            => 'footer_logo',
				'description'   => __( 'Логотип в подвале сайта.', 'theater' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h3 class="widgettitle">', 
				'after_title'   => '</h3>'
			)
		);

		register_sidebar(
			array(
				'name'          => __( 'Footer contacts', 'theater' ),
				'id'            => 'footer_contacts',
				'description'   => __( 'Блок с контактной информацией в подвале сайта.', 'theater' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h3 class="widgettitle">', 
				'after_title'   => '</h3>'
			)
		);

		register_sidebar(
			array(
				'name'          => __( 'Footer Links One', 'theater' ),
				'id'            => 'footer_links_one',
				'description'   => __( 'Первый блок для ссылок в подвале сайта.', 'theater' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h3 class="widgettitle">', 
				'after_title'   => '</h3>'
			)
		);

		register_sidebar(
			array(
				'name'          => __( 'Footer Links Two', 'theater' ),
				'id'            => 'footer_links_two',
				'description'   => __( 'Второй блок для ссылок в подвале сайта.', 'theater' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h3 class="widgettitle">', 
				'after_title'   => '</h3>'
			)
		);

		register_sidebar(
			array(
				'name'          => __( 'Footer Links Three', 'theater' ),
				'id'            => 'footer_links_three',
				'description'   => __( 'Третий блок для ссылок в подвале сайта.', 'theater' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h3 class="widgettitle">', 
				'after_title'   => '</h3>'
			)
		);
		register_sidebar(
			array(
				'name'          => __( 'Button SickEyes View', 'theater' ),
				'id'            => 'sickeyes-view',
				'description'   => __( 'Виджет, который добавляет кнопку для переключения вида для слабовидящих', 'theater' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h3 class="widgettitle">', 
				'after_title'   => '</h3>'
			)
		);

	}
}






?>