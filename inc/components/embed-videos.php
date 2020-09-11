<?php
/**
  * Post video
 *
 * @package mywptheme
 */


/*  Add responsive container to embeds
/* ------------------------------------ */ 

if (!is_admin()) {
    add_filter( 'embed_oembed_html', 'wpse_embed_oembed_html', 99, 4 );
    function wpse_embed_oembed_html( $cache, $url, $attr, $post_ID ) {
        $classes = array();

        // Add these classes to all embeds.
        $classes_all = array(
            'embed-container'
        );

        // Check for different providers and add appropriate classes.
        $is_video = false;
        $video_id = $thumbnail_url = $video_type = $video_title = '';

        if ( false !== strpos( $url, 'vimeo.com' ) ) {
            $is_video = true;
            $classes[] = 'vimeo';
            $video_type = 'vimeo';

            $re = '/(http|https)?:?\/\/(www\.)?(player\.)?vimeo.com\/(?:(album\/\w*\/video\/)|(video\/)|channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/';

            preg_match($re, $url, $matches, PREG_OFFSET_CAPTURE, 0);

            if ($matches){
                if (isset($matches[7][0])){
                    $video_id = $matches[7][0];
                    $url = 'http://vimeo.com/api/v2/video/'.$video_id.'.php';  
                    
                    // Initialize a CURL session.  
                    $ch = curl_init();  
                    
                    // Get the response from cURL
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
                    
                    // Grab URL and pass it to the variable  
                    curl_setopt($ch, CURLOPT_URL, $url);  
                    
                    $vimeo_file = curl_exec($ch);
                    curl_close($ch);

                    if ($vimeo_file !== FALSE) {
                        $hash = unserialize($vimeo_file);
                        $thumbnail_url = $hash[0]['thumbnail_large'];
                    }
                }
            }


            // Get video title
            $title_re = '/title="([^"]+)"/';

            preg_match($title_re, $cache, $title_matches, PREG_OFFSET_CAPTURE, 0);

            if ($title_matches){
                if (isset($title_matches[1][0])) {
                    $video_title = $title_matches[1][0];
                }
            }

            array_push($classes_all, 'vimeo');

            $iframe = '<iframe class="iframe" src="https://player.vimeo.com/video/'.$video_id.'?api=1" title="'.$video_title.'" width="580" height="326" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0" allow="autoplay; fullscreen"></iframe>';
        }

        if ( false !== strpos( $url, 'youtube.com' ) || false !== strpos( $url, 'youtu.be' ) ) {
            $is_video = true;
            $classes[] = 'youtube';
            $video_type = 'youtube';

            $re = '/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})(?:(?:(?:\?|\&)t|&start)=([\d]*[s|m]{0,1})([\d]*s{0,1}))?.*/';

            preg_match($re, $url, $matches, PREG_OFFSET_CAPTURE, 0);


            $time = '';
            $seconds = 0;
            
            if ($matches){
                if (isset($matches[1][0])){
                    $video_id = $matches[1][0];
                    $thumbnail_url = 'https://img.youtube.com/vi/'.$video_id.'/hqdefault.jpg';
                }

                if (isset($matches[2][0]) || isset($matches[3][0])){
                    if (isset($matches[2][0])) {
                        $group1 = $matches[2][0];

                        if (strpos($group1, 'm') !== false) {
                            $seconds = intval($group1)*60;
                        } else {
                            $seconds = intval($group1);
                        }
                    }
                    if (isset($matches[3][0])) {
                        $group2 = $matches[3][0];

                        if ($group2) {
                            $seconds = $seconds+intval($group2);
                        }
                    }

                    $time = 'start='.$seconds.'&';
                }
            }


            // Get video title
            $title_re = '/title="([^"]+)"/';

            preg_match($title_re, $cache, $title_matches, PREG_OFFSET_CAPTURE, 0);

            if (isset($title_matches[1][0])) {
                $video_title = $title_matches[1][0];
            }

            array_push($classes_all, 'youtube');

            $iframe = '<div class="iframe youtube-video" title="'.$video_title.'" data-iframe-src="'.$video_id.'" data-iframe-origin="'.esc_url(home_url()).'" data-iframe-start="'.$seconds.'"><noscript><iframe class="youtube-video" title="'.__('Youtube video','kobu').'" width="640" height="360" src="https://www.youtube.com/embed/'.$video_id.'?'.$time.'modestbranding=1&showinfo=0&rel=0&enablejsapi=1&origin='.esc_url(home_url()).'" webkitallowfullscreen mozallowfullscreen allowfullscreen> </iframe></noscript></div>';
        }

        $classes = array_merge( $classes, $classes_all );

        if ($is_video && !is_admin()) {
            
            $output = '<div class="' . esc_attr( implode( ' ', $classes ) ) . '">';
                if ($is_video && $video_id) {
                    $output .= '<div class="video-placeholder" style="background-image: url('.$thumbnail_url.');"></div>';
                }
                $output .= $iframe;

            $output .= '</div>';

            return $output;
        } else {
            return $cache;
        }
    }
}
