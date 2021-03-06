'use strict';
(function () {
  // Константы
  var FILTER_NEW = 'new';
  var FILTER_DISCUSSED = 'discussed';

  // Переменные
  var simularPictures = document.querySelector('.pictures');
  var filterPictures = document.querySelector('.img-filters');
  var filterPicturesButtons = filterPictures.querySelectorAll('.img-filters__button');
  var pageMainTag = document.querySelector('main');
  var cachedPictures = [];

  // Функции
  // Заполнение блока DOM-элементами на основе массива JS-объектов
  var generateElements = function (array, createElement, appendTo) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(createElement(array[i]));
    }
    appendTo.appendChild(fragment);
  };

  // Скрытие подсветки кнопки фильтра
  var hideActiveFilterButton = function (button) {
    button.classList.remove('img-filters__button--active');
  };

  var clearActiveClassFiltersButton = function () {
    filterPicturesButtons.forEach(function (button) {
      hideActiveFilterButton(button);
    });
  };

  // Отображение подсветки кнопки фильтра
  var createActiveClassFilterButton = function (button) {
    button.classList.add('img-filters__button--active');
  };

  // Удаление всех фотографий со странице
  var clearPictures = function () {
    var renderedPictures = simularPictures.querySelectorAll('.picture');
    renderedPictures.forEach(function (pictures) {
      simularPictures.removeChild(pictures);
    });
  };

  // Фильтр фотографий
  var onFilterButtonClick = function (evt) {
    var activeFilterButton = evt.target;

    clearActiveClassFiltersButton();
    createActiveClassFilterButton(activeFilterButton);
    clearPictures();

    var filterAttributeId = activeFilterButton.getAttribute('id');
    var filterName = filterAttributeId.split('-')[1];

    switch (filterName) {
      case FILTER_NEW:
        return generateElements(window.picturesFilter.filterNewPictures(cachedPictures), window.createPicture, simularPictures);
      case FILTER_DISCUSSED:
        return generateElements(window.picturesFilter.filterMostDiscussedPictures(cachedPictures), window.createPicture, simularPictures);
      default:
        return generateElements(cachedPictures, window.createPicture, simularPictures);
    }
  };

  var onLoad = function (pictures) {
    // Создание копии массива
    cachedPictures = pictures.slice();

    // Отображении информации из массива на странице
    generateElements(pictures, window.createPicture, simularPictures);

    // Обработчики на кнопки фильтров
    filterPicturesButtons.forEach(function (button) {
      button.addEventListener('click', window.debounce(onFilterButtonClick));
    });

    // Поиск большой фотографии, соответствующей маленькой
    var findPicture = function (evt) {
      if (evt.target.parentNode.className === 'picture') {
        for (var i = 0; i < pictures.length; i++) {
          if (pictures[i].url === evt.target.parentNode.id) {
            window.createBigPicture(pictures[i]);
          }
        }
      }
    };

    // Обработчик на маленькую фотографию для открытия большой
    simularPictures.addEventListener('click', function (evt) {
      findPicture(evt);
    });

    // Отображение фильтров фотографий
    filterPictures.classList.remove('img-filters--inactive');
  };

  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red; color: #ffffff';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.top = '20px';
    node.style.fontSize = '24px';

    node.textContent = errorMessage;
    pageMainTag.insertAdjacentElement('afterbegin', node);
  };

  // Код программы
  window.backend.loadData(onLoad, onError);
})();
