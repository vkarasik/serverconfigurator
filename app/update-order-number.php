<?php
    if( ! empty($_POST) ){
        $data = (object) $_POST;
        $json = json_encode($data);
        // Перезаписываем файл
        file_put_contents('js/numbering.json', $json);
    }
?>