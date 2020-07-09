<?php
if (!empty($_POST)) {

    $data = (object) $_POST;
    $to = 'v.karasik@cd-life.by, a.starostin@cd-life.by, ' . $data->manager . ', ' . $data->email;
    $subject = 'Сборка сервера №' . $data->num;
    $message = "Компания: " . $data->company . "<br>" . "Конфигурация: " . $data->config . "<br>" . "Цена: " . $data->price . " USD без НДС" . "<br>" . "Количество: " . $data->number . " шт" . "<br>" . "Срок поставки: " . $data->avail . " дн" . "<br>" . "Комментарий: " . $data->comment;

    // На случай если какая-то строка письма длиннее 70 символов мы используем wordwrap()
    $message = wordwrap($message, 70, "\r\n");

    $headers = "Content-type: text/html; charset=utf-8 \r\n" . "From: Конфигуратор <from@example.com>\r\n";

    mail($to, $subject, $message, $headers);

    //echo ('Ваш запрос отправлен!');
}
