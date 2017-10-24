<?php
if( ! empty($_POST) ) {

    $data = (object) $_POST;
    $to = 'v.karasik@cd-life.by, ' . $data->manager . ', ' . $data->email;
    $subject = 'Сборка сервера №'. $data->num;
    $message = 'Компания: ' . $data->company . ' / Конфигурация: ' . $data->config . ' / Цена: ' . $data->price . ' / Количество: ' . $data->number . ' шт' . ' / Срок поставки: ' . $data->avail . ' дн';

    $headers  = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: Конфигуратор <from@example.com>\r\n";

    mail($to, $subject, $message, $headers);

    //echo ('Ваш запрос отправлен!');
} 
?>