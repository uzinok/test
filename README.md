BOLT-SLIDER набор плагинов для создания слайдеров на сайте
=====================

Подготовил: [Александр Зиновьев](http://uzinok.ru/)
-----------------------------------

Команды
-----------------------------------

* gulp - сборка проекта и запуск сервера

Настройки
-----------------------------------
* `sliderList` - список слайдов
* `count` - какой слайд показать
* `gap` - расстояние между слайдами
* `speed` - скорость смены слайдов
* `adaptiveHeight` - адаптивная высота слайдера при смене слайдов
* `sliderPrew` - кнопка вперед
* `sliderNext` - кнопка назад
* `paginationWrap` - блок для пагинации
* `paginationTag` - указывает тег для кнопок пагинации. Если `button` то делает список кнопок, добавляет атрибуты для доступности
* `paginationClass` - указывает какой класс задать кнопкам пагинации
* `paginationAria` - указывает текст для ариа атрибута `paginationAria: 'из' => aria-label="1 из 3"`

Атрибуты необходимые для слайдера
-----------------------------------

* для кнопки вперед `aria-label="Next."`, нужно добавлять вручную
* для кнопки назад `aria-label="Previous."`, нужно добавлять вручную
* для кнопок пагинации `aria-label="1 of 3."`, добавляет скрипт ('of' можно заменить с помощью `paginationAria`)

перед установкой сборщика необходимо:
-----------------------------------

* [устнаовить node.js](https://nodejs.org/) используется пакет npm
* [глобально установить gulp](https://gulpjs.com/) для работы команд gulp
* [глобально установить browser-sync](https://browsersync.io/) для работы виртуального сервера