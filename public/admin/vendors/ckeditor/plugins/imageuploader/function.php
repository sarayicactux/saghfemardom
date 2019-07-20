<?php

if(isset($_GET["f"])){
    $f = filter_input(INPUT_GET, 'f', FILTER_SANITIZE_STRING);
    if($f = "loadImages") {
        loadImages();
    }
}

function loadImages() {
    require(__DIR__ . '/pluginconfig.php');

    if(file_exists($useruploadpath)){
        
        $filesizefinal = 0;
        $count = 0;
        
        $dir = $useruploadpath;
        $files = glob("$dir*.{jpg,jpe,jpeg,png,gif,ico}", GLOB_BRACE);
        usort($files, create_function('$a,$b', 'return filemtime($a) - filemtime($b);'));
        for($i=count($files)-1; $i >= 0; $i--):
            $image = $files[$i];
            $image_pathinfo = pathinfo($image);
            $image_extension = $image_pathinfo['extension'];
            $image_filename = $image_pathinfo['filename'];
            $image_basename = $image_pathinfo['basename'];
        
            // image src/url
            $protocol = !empty($_SERVER['HTTPS']) ? 'https://' : 'http://';
            $site = $protocol. $_SERVER['SERVER_NAME'] .'/';
            $image_url = $useruploadfolder."/".$image_basename;

            $size = getimagesize($image);
            $image_height = $size[0];
            $file_size_byte = filesize($image);
            $file_size_kilobyte = ($file_size_byte/1024);
            $file_size_kilobyte_rounded = round($file_size_kilobyte,1);
            $filesizetemp = $file_size_kilobyte_rounded;
            $filesizefinal = $filesizetemp . " KB";
            $calcsize = $filesizefinal;
            $count = ++$count;
            
            ?>
                <div class="fullWidthFileDiv"
                     onclick="alert('<?php echo $image_url; ?>');"
                     ondblclick="alert('<?php echo $image_url; ?>';"
                    >
                    <div class="fullWidthimgDiv"></div>
                    <p class="fullWidthfileDescription"><?php echo $image_filename; ?><?php if($file_extens == "yes"){echo ".$image_extension";} ?></p>

                    <div class="qEditIconsDiv">
                        <img title="Delete File" src="img/cd-icon-qtrash.png" class="qEditIconsImg" onclick="window.location.href = 'imgdelete.php?img=<?php echo $image_basename; ?>'">
                    </div>

                    <p class="fullWidthfileTime fullWidthfileMime fullWidthlastChild"><?php echo $image_extension; ?></p>
                    <p class="fullWidthfileTime"><?php echo $filesizetemp; ?> KB</p>
                    <p class="fullWidthfileTime fullWidth30percent"><?php echo date ("F d Y H:i", filemtime($image)); ?></p>
                </div>
            <?php

        endfor;
        if($count == 0){
            echo "<div class='fileDiv' style='display:none;'></div>";
            $calcsize = 0;
        }
        if($calcsize == 0){
            $filesizefinal = "0 KB";
        }
        if($calcsize >= 1024){
            $filesizefinal = round($filesizefinal/1024,1) . " MB";
        }
        
        echo "
        <script>
            $( '#finalsize' ).html('$filesizefinal');
            $( '#finalcount' ).html('$count');
        </script>
        ";
    } else {
        echo '<div id="folderError">'.$alerts9.' <b>'.$useruploadfolder.'</b> '.$alerts10;
    }
}

function pathHistory() {
    require(__DIR__ . '/pluginconfig.php');
    $latestpathes = array_slice($foldershistory, -3);
    $latestpathes = array_reverse($latestpathes);
    foreach($latestpathes as $folder) {
        echo '<p class="pathHistory" onclick="useHistoryPath(\''.$folder.'\');">'.$folder.'</p>';
    }
}