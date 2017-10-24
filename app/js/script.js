$(function(){
    
    // Генерация случайного номера
    function generateNumber(){
        return parseInt(Math.random()*(10000-1000)+1000);
    };
    
    // Обновление итоговой цены
    function calculateTotalPrice(){

        var totalPrice = 0;
        $('.price').each(function(){
            // собрать все цены
            var price = +($(this).html());
            // просуммировать все значения
            totalPrice += price;
            // обновить общую цену
            $('.total-price').text(totalPrice);   
        });    
    };

    // Обновление итогового наименования
    function rewriteTotalName(){
        
        $('.shortname').each(function(){
            //получим класс из соответвующего id
            var cmptClass ='.' + $(this).parent().attr('id');
            //получим значение короткого имени из скрытой колонки
            var shortName = $(this).html();
            //получим введеное количество
            var number = +($(this).siblings('.number').find('input').val());
            //проверим что введено коректное значение
            if(number <= 0 || isNaN(number)){
                number = '';
            }
            else{
                number = '(x' + number + ')';
            }
            //вставим короткое имя в блок с соотвествующим классом
            $(cmptClass).html(shortName + number + '/');
        });
    };
    
    // Расчет цены в зависимости от количества
    function calculateCountPrice(){
        // получим цену на конфигурацию
        var totalPrice = +($('.total-price').html());
        // получим введеное количество
        var count = +($('#server-count').val());
        if(count == 0){count = 1;}
        $('.price-for-count').html(totalPrice * count);
    };
    
    // Расчет срока поставки
    function calculateTotalAvail(){
        
        // соберем все значения в массив
        var availArr = [];
        $('.avail').each(function(){
            availArr.push(+$(this).text());
        });
        // возмем максимальное значение
        var maxAvail = Math.max.apply(null, availArr);
        $('.total-avail').html(maxAvail);
    };
    
    // Проверка соответствия компонентов
    function checkRelevant(){
        var curPlatform = $('#platform .component').attr('data-relevant');
    };
    
    // Удалить все дубли подкатегорий
    function delDoublesSubcat(){
        
        var subCats = {};
        $('.subcategory td').each(function(){
            // получим название подкатегории
            var txt = $(this).text();
            if (subCats[txt]){
                // если в объекте есть такой текст, то удалим родительскую строку
                $(this).parent().remove();    
            }
            else{
                subCats[txt] = true;    
            }
        })    
    };
    
    // Удаление пустых подкатегорий
    function delEmptySubcat(){
        $('.subcategory').each(function(){
            if(!($(this).next().hasClass('component-item'))){
                $(this).remove();   
            }
        })    
    }
    
    // Очистить все компоненты
    function clearAll(){
        $('#confurator-table td').not('.component').html('');
        $('.component').attr('data-relevant', '');
    }
    
    // Удалить все дополнительные компоненты
    function delAllAdditionalCmpt(){
        $('.addition-component').remove();
    }
    
    // Удалить дополнительный копонент
    function delAdditionalCmpt(){
        console.log($(this));
        $(this).parent().remove();
        var curCmptId = $(this).parents('tr').attr('id');
        // удалим блок из итогового наименования
        $('.' + curCmptId).remove();
    }
    
    // Событие изменения количества компонентов
    $('table').on('keyup input', 'input', function(){
        // получим введеное кол-во
        var number = +($(this).val());
        // цена из скрытой ячейки
        var price = +($(this).parent().siblings('.price-hidden').html());
        if(number == 0){
            number = 1;
        };
        $(this).parent().siblings('.price').html(price*number);
        calculateTotalPrice();
        rewriteTotalName();
        calculateCountPrice();
    });
    
    // Очистить все компоненты
    $('#clear-all').click(function(){
        clearAll(); // очистим все строки
        delAllAdditionalCmpt(); // удалим все дополнительные строки
        calculateTotalPrice(); // пересчитаем цену
        rewriteTotalName(); // перепишем наименование
        calculateCountPrice(); // пресчитаем цены
        calculateTotalAvail(); // пересчитаем доставку
    })
    
    // Добавление дополнительного компонента
    $('#add-cmpt').click(function(){
        // получим имя выбранного компонента
        var additionalComponent = $('#additional-cmpt option:selected');
        // получим имя для нового id
        var additionalDataCmpt = additionalComponent.attr('data-component');
        // получим обновленное имя для id
        var additionalUpdateCmpt= $('#additional-cmpt option:selected').attr('data-updatedcmpt');
        // новый id для компонента 
        var newAdditionalId = '';
        
        // проверим есть ли в таблице элемент с похожим id
        $('#confurator-table tr').each(function(){
            
            if($(this).attr('id') == additionalUpdateCmpt){
                // если найден похожий id, то прибавим к имени 1
                newAdditionalId = $(this).attr('id') + 1;
                // обновим атрибут у элемента select
                additionalComponent.attr('data-updatedcmpt', newAdditionalId);
            }
            else{
                newAdditionalId = $('#additional-cmpt option:selected').attr('data-updatedcmpt');
            }
        });
        
        // добавим новую строку с компонентом
        $('#confurator-table tbody').append('<tr id="'+newAdditionalId+'" class="addition-component"><td class="component"><a href="#" class="add-cmpt" data-toggle="modal" data-target=".bs-example-modal-lg" data-component="'+additionalDataCmpt+'">'+ additionalComponent.text() +'</a></td><td class="name"></td><td class="shortname"></td><td class="price"></td><td class="price-hidden"></td><td class="avail"></td><td class="number"></td><td class="del-cmpt"><button type="button" class="btn btn-danger btn-xs" title="Удалить компонент"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></td></tr>');
        
        // добавим новый блок для компонента в итоговое имя конфигурации
        $('.' + additionalDataCmpt).after('<span class="'+newAdditionalId+' addition-component"></span>')
    });
    
    
    // Удаление дополнительного компонента
    $('#confurator-table tbody').on('click', '.del-cmpt', function(){
        delAdditionalCmpt.apply($(this)); // удаление строки компонента
        calculateTotalPrice(); // пересчитаем цену
        rewriteTotalName(); // перепишем наименование
        calculateCountPrice(); // пресчитаем цены
        calculateTotalAvail(); // пересчитаем доставку
    });
    
    // Очистка строки компонента
    $('.clear').click(function(){
        // очистим все ячейки кроме текущей
        $(this).siblings().not('.component').html('');
        $(this).siblings('.component').attr('data-relevant', '');
        $(this).html('');
        
        calculateTotalPrice(); // пересчитаем цену
        rewriteTotalName(); // перепишем наименование
        calculateCountPrice(); // пресчитаем цены
        calculateTotalAvail(); // пересчитаем доставку
    });
    
    // Показать список компонентов для выбора
    $('#confurator-table tbody').on('click', '.add-cmpt', function(){
        
        // возьмем текст для заголовка окна
        var modalHeadText = $(this).html();
        // установим заголовок модального окна
        $('.modal-title').html(modalHeadText);
        // очистим таблицу в модальном окне
        $('.modal-body .table tbody').html('');
        //id строки текущего элемента
        var curCmptRowId = $(this).parents('tr').attr('id');
        // категория компонента для вывода товаров в модальное окно
        var curComponent = $(this).attr('data-component');
        // случайный номер для ссылки на json
        var jsonSource = 'js/price.json?' + parseInt(Math.random()*(10000-1000)+1000);
        $.getJSON(jsonSource, {cache: false}, function(data){
            
            // массив товаров для текущей категории
            var curComponentArr = data[curComponent]; 

            // Показывать только совместимые компоненты
            if($('.checkbox input')['0'].checked){
                
                // Для Платформы нужно показывать подкатегории
                if(curComponent=='platform'){
                    // При повторном выборе компонента Платформа сбросить значение relevant
                    $('#platform .component').attr('data-relevant', '');
                    
                    // добавим в таблицу все подкатегории компонента
                    for(i=0;i<curComponentArr.length;i++){
                        var curSubCat = curComponentArr[i].subcategory;
                        var newSubCat = '<tr class="subcategory"><td colspan="5">'+curSubCat+'</td></tr>';
                        $('.modal-body .table tbody').append(newSubCat);
                    };
                    
                    // Удалим дубли подкатегорий
                    delDoublesSubcat();

                    // выведем все компоненты для текущей категории
                    for(i=0;i<curComponentArr.length;i++){
                        // текщая подкатегория
                        var curSubCat = curComponentArr[i].subcategory;
                        var curRelevant = curComponentArr[i].relevant;
                        // строка с текущей подкатегорией
                        var subCat = $('.modal-body .table tbody tr td:contains('+curSubCat+')').parent();
                        // ссылка на описание для текущего компонента
                        var curLink = curComponentArr[i].link;
                        // если не пустая, состадим html для ссылки
                        if(curLink !== ''){curLink = '<br><a href="' + curLink + '" target="_blank" rel="nofollow noopener" rel=noreferrer>Подробное описание...</a>'};
                        // выведем элементы после строки с подкатегорией

                        var curPlatform = $('#platform .component').attr('data-relevant');
                        if(curRelevant.indexOf(curPlatform)+1){
                            
                            // Выведеим все элементы под подкатегории
                            $(subCat).after('<tr class="component-item" data-relevant="'+curRelevant+'"><td class="cmpt-name">' + curComponentArr[i].name + curLink + '</td><td class="cmpt-shortname" style="display:none">' + curComponentArr[i].shortname + '</td><td class="cmpt-price">' + curComponentArr[i].price + '</td><td class="cmpt-avail">' + curComponentArr[i].availability + '</td><td class="choose"><button class="btn btn-primary choose-cmpt" data-dismiss="modal">Выбрать</button></td></tr>');
                        }
                    }
                    
                    delEmptySubcat();
                    
                    
                }
                
                else if($('#platform .component').attr('data-relevant') == ''){
                    $('.modal-body tbody').append('<tr class="bg-danger"><td colspan="4">Выберите платформу, или снимите флаг "Учитывать совместимость компонентов"</td></tr>');
                    // Завершить выполнение и не выводить компоненты
                    return false; 
                }

                // выведем все компоненты для текущей категории
                if(curComponent!=='platform'){
                    
                    // добавим в таблицу все подкатегории компонента
                    for(i=0;i<curComponentArr.length;i++){
                        var curSubCat = curComponentArr[i].subcategory;
                        var newSubCat = '<tr class="subcategory"><td colspan="5">'+curSubCat+'</td></tr>';
                        $('.modal-body .table tbody').append(newSubCat);
                    };
                    
                    // Удалим дубли подкатегорий
                    delDoublesSubcat();
                    
                    for(i=0;i<curComponentArr.length;i++){
                        var curSubCat = curComponentArr[i].subcategory;
                        // текущее значение relevant
                        var curRelevant = curComponentArr[i].relevant;
                        var subCat = $('.modal-body .table tbody tr td:contains('+curSubCat+')').parent();
                        // ссылка на описание для текущего компонента
                        var curLink = curComponentArr[i].link;
                        // если не пустая, состадим html для ссылки
                        if(curLink !== ''){curLink = '<br><a href="' + curLink + '" target="_blank" rel="nofollow noopener" rel=noreferrer>Подробное описание...</a>'};

                        // выведем элементы без подкатегорий
                        // проверим указана ли совместимая платформа или иной символ
                        if(curRelevant.indexOf($('#platform .component').attr('data-relevant'))!==-1 || curRelevant.indexOf('forall')!==-1){
                            //return false;
                            $(subCat).after('<tr class="component-item" data-relevant="'+curRelevant+'"><td class="cmpt-name">' + curComponentArr[i].name + curLink + '</td><td class="cmpt-shortname" style="display:none">' + curComponentArr[i].shortname + '</td><td class="cmpt-price">' + curComponentArr[i].price + '</td><td class="cmpt-avail">' + curComponentArr[i].availability + '</td><td class="choose"><button class="btn btn-primary choose-cmpt" data-dismiss="modal">Выбрать</button></td></tr>');
                        }
                    }
                    
                    delEmptySubcat();
                }
                
            }
            
            // Показывать все компоненты
            else{
                
                // добавим в таблицу все подкатегории компонента
                for(i=0;i<curComponentArr.length;i++){
                    var curSubCat = curComponentArr[i].subcategory;
                    var newSubCat = '<tr class="subcategory"><td colspan="5">'+curSubCat+'</td></tr>';
                    $('.modal-body .table tbody').append(newSubCat);
                };
            
                delDoublesSubcat();

                // выведем все компоненты для текущей категории
                for(i=0;i<curComponentArr.length;i++){
                    // текщая подкатегория
                    var curSubCat = curComponentArr[i].subcategory;
                    var curRelevant = curComponentArr[i].relevant;
                    // строка с текущей подкатегорией
                    var subCat = $('.modal-body .table tbody tr td:contains('+curSubCat+')').parent();
                    // ссылка на описание для текущего компонента
                    var curLink = curComponentArr[i].link;
                    // если не пустая, состадим html для ссылки
                    if(curLink !== ''){curLink = '<br><a href="' + curLink + '" target="_blank" rel="nofollow noopener" rel=noreferrer>Подробное описание...</a>'};
                    
                    // выведем элементы после строки с подкатегорией
                    $(subCat).after('<tr data-relevant="'+curRelevant+'"><td class="cmpt-name">' + curComponentArr[i].name + curLink + '</td><td class="cmpt-shortname" style="display:none">' + curComponentArr[i].shortname + '</td><td class="cmpt-price">' + curComponentArr[i].price + '</td><td class="cmpt-avail">' + curComponentArr[i].availability + '</td><td class="choose"><button class="btn btn-primary choose-cmpt" data-dismiss="modal">Выбрать</button></td></tr>');
                }
            }
 
            // выбор компонента
            $('.choose-cmpt').click(function(){
                var cmptName = $(this).parent().siblings('.cmpt-name').html();
                var cmptShortName = $(this).parent().siblings('.cmpt-shortname').text();
                var cmptPrice = $(this).parent().siblings('.cmpt-price').text();
                var cmptAvail = $(this).parent().siblings('.cmpt-avail').text();
                var cmptRelevant = $(this).parents('tr').attr('data-relevant');

                // id строки в которую вставить выранный компонент
                var targetRow = '#' + curCmptRowId;
                $(targetRow).find('.name').html(cmptName);
                $(targetRow).find('.shortname').text(cmptShortName);
                $(targetRow).find('.price, .price-hidden').text(cmptPrice);
                $(targetRow).find('.avail').text(cmptAvail);
                $(targetRow).find('.number').html('<input type="text" class="form-control" placeholder="1">');
                $(targetRow).find('.clear').html('<button type="button" class="btn btn-danger btn-xs" title="Очистить выбор"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
                $(targetRow).find('.component').attr('data-relevant', cmptRelevant);
                
                calculateTotalPrice(); // пересчитаем цену
                rewriteTotalName(); // перепишем наименование
                calculateCountPrice(); // пресчитаем цены
                calculateTotalAvail(); // пересчитаем доставку
                checkRelevant();
            }); 
        });
    });
    
    // Получение номера для сборки и перезапись в json 
    function getOrderNumber(callback){
        // Случайное число для адреса json
        var jsonSource = 'js/numbering.json?' + parseInt(Math.random()*(10000-1000)+1000);
        var $orderNum = {};
        $.getJSON(jsonSource, {cache: false}, function(data){
            $orderNum = data;
            $orderNum.lastOrderNumber = +($orderNum.lastOrderNumber) + 1;

            $.ajax({
                type: 'POST',
                url: 'update-order-number.php',
                data: $orderNum,
                success: function(response){
                },
                error: function(response){
                    alert('Произошла ошибка! Пожалуйста повторите отправку!');
                }
            });
            callback($orderNum.lastOrderNumber);
        });
    };

    // Отправка конфигурации на почту
    $('form').submit(function(e){
        // Отмена перезагрузки страницы при submit
        e.preventDefault();
        var $form = $(this);
        // Получение номера конфигурации
        getOrderNumber(function(orderNum){
            var configNum = orderNum;
            var $config = $('.total-name').text();
            var $price = $('.total-price').text();
            var $avail = $('.total-avail').text();
            var $number = $('#server-count').val();
            if($number <= 0){$number=1};
            var $manager = $('#managers option:selected').attr('data-email');
            if($manager == 'default'){alert('Не выбран менеджер');return false;}
            //var configNum = generateNumber();
            var $data = $form.serialize() + '&config=' + $config + '&price=' + $price + '&number=' + $number + '&num=' + configNum + '&manager=' + $manager + '&avail=' + $avail;
            $.ajax({
              type: $form.attr('method'),
              url: $form.attr('action'),
              data: $data,
              success: function(response){
                  // сбросить форму
                  $('form')[0].reset();
                  $('form button').toggleClass('btn-primary btn-success').text('Конфигурация отправлена!');
              },
              error: function(response){
                  alert('Произошла ошибка! Пожалуйста повторите отправку!');
              }
            })
        })
    });
    
    // Редактирование прайса
    var price = {};
    $('.show-price').click(function(){
        $('.price tbody').html('');    
        // выведем все элементы прайса
        $.getJSON('js/price.json', {cache: false}, function(data){
            price = data;
            // получим все категории прайса
            for(var key in price){
                // массив компонентов текущей категории
                var category = price[key];
                // имя свойства для записи в class строки компонента
                var keyCat = key;
                // вывод компонентов в таблицу
                for(i=0;i<category.length;++i){
                    $('.price tbody').append('<tr class="'+keyCat+'"><td class="name">'+price[key][i].name+'</td><td><input type="text" class="form-control" value="'+price[key][i].price+'"></td><td><input type="text" class="form-control" value="'+price[key][i].availability+'"></td></tr>')
                };  
            }; 
        });    
    });
    
    // Обновить информацию в объекте price
    $('.price tbody').on('keyup input','.form-control', function(){
        var value = $(this).val();
        // class текущей строки
        var rowCategory = $(this).parents('tr').attr('class');
        // получим индекс текущей строки среди срок с текущим классом
        var rowIndex = $(this).parents('tr').index('.' + rowCategory);
        // присвоим новое значение свойству объекта price
        price[rowCategory][rowIndex].price = value;
    });
    
    // Сохранить изменение цен
    $('.pricelist').on('click','.save-pice',function(){
        var $data = price;
        console.log($data);
        
        $.ajax({
            type: 'POST',
            url: 'rewriteprice.php',
            data: $data,
            success: function(response){
                $('.save-price').toggleClass('btn-primary btn-success').text('Прайс обновлен!');
            },
            error: function(response){
                alert('Произошла ошибка! Пожалуйста повторите отправку!');  
            }
        });    
    });
});

// Я зрабіў усё што змог, хто зможа, хай зробіць лепш!
