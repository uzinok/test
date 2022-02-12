"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*! https://github.com/uzinok/bolt-slider */
var BoltSlider = /*#__PURE__*/function () {
  function BoltSlider(options) {
    _classCallCheck(this, BoltSlider);

    var _ = this; // errors user options


    if (!options) {
      return console.warn('Not slider options');
    }

    if (!document.querySelector(options.slider)) {
      return console.warn('didn\'t get html element: slider');
    }

    if (options.sliderPrew && !document.querySelector(options.sliderPrew)) {
      console.warn('didn\'t get html element: sliderPrew');
      options.sliderPrew = false;
    }

    if (options.playButton && !document.querySelector(options.playButton)) {
      console.warn('didn\'t get html element: sliderPrew');
      options.playButton = false;
    }

    if (options.sliderNext && !document.querySelector(options.sliderNext)) {
      console.warn('didn\'t get html element: sliderNext');
      options.sliderNext = false;
    }

    if (options.paginationWrap && !document.querySelector(options.paginationWrap)) {
      console.warn('didn\'t get html element: paginationWrap');
      options.paginationWrap = false;
    } // user options


    _.slider = document.querySelector(options.slider);
    _.roledescription = options.roledescription || 'carousel';
    _.slideRoledescription = options.slideRoledescription || 'slide';
    _.gap = options.gap || 0;
    _.currentSlide = options.currentSlide || 0;
    _.speed = options.speed || 300;
    _.loop = options.loop || false;
    _.autoPlay = options.autoPlay || false;
    _.autoplaySpeed = options.autoplaySpeed || 0; // playClass for slider options

    _.playClass = options.playButton || false;
    _.playButton = document.querySelector(options.playButton);
    _.sliderPrew = document.querySelector(options.sliderPrew) || false;
    _.sliderNext = document.querySelector(options.sliderNext) || false;
    _.paginationWrap = document.querySelector(options.paginationWrap) || false;
    _.paginationTag = options.paginationTag || 'span';
    _.paginationClass = options.paginationClass || 'bolt-slider__paginaton-btn';
    _.paginationAria = options.paginationAria || 'Go to slide'; // errors slider options

    if (!_.slider.querySelector('.bolt-slider__list-wrap')) {
      return console.warn('didn\'t get html element: slider wrap list');
    }

    if (!_.slider.querySelector('.bolt-slider__list')) {
      return console.warn('didn\'t get html element: slider list');
    }

    if (!_.slider.querySelector('.bolt-slider__item')) {
      return console.warn('didn\'t get html element: slider items');
    }

    if (!_.slider.querySelector('.bolt-slider__content')) {
      return console.warn('didn\'t get html element: slider contents');
    } // slider options


    _.width = 0;
    _.sliderListWrap = _.slider.querySelector('.bolt-slider__list-wrap');
    _.sliderList = _.slider.querySelector('.bolt-slider__list');
    _.sliderItems = _.sliderList.querySelectorAll('.bolt-slider__item');
    _.sliderItems = Array.prototype.slice.call(_.sliderItems); // for IE

    _.slide = _.sliderList.querySelectorAll('.bolt-slider__content');
    _.slideLength = _.sliderItems.length;
    _.paginations = [];
    _.checkAutoPlay = _.autoPlay;
    _.setIntervalAutoPlay = false;
    _.startClientX = 0;
    _.timeOutAnimation;

    if (_.loop) {
      _.currentSlide += 1;
    }

    if (_.currentSlide > _.slideLength) {
      _.currentSlide = 0;
    } // init slider


    _.sliderInit();
  }

  _createClass(BoltSlider, [{
    key: "sliderInit",
    value: function sliderInit() {
      var _ = this;

      _.slider.classList.remove('bolt-no-js');

      _.slider.setAttribute('aria-roledescription', _.roledescription);

      if (_.loop) {
        _.createLoop();
      }

      for (var i = 0; i < _.slideLength; i++) {
        _.sliderItems[i].ariaLive = 'off';

        _.sliderItems[i].setAttribute('aria-roledescription', _.slideRoledescription);

        _.sliderItems[i].setAttribute('tabindex', -1);
      }

      _.setSliderSize();

      window.addEventListener('resize', function () {
        _.setSliderSize();

        _.moveSlider();
      });

      if (_.paginationWrap) {
        _.setPagination();
      }

      if (_.sliderNext) {
        _.moveNext();
      }

      if (_.sliderPrew) {
        _.movePrew();
      }

      _.updateSlide();

      _.moveSlider();

      if (_.checkAutoPlay) {
        _.autoPlayControl();
      }

      if (_.playButton) {
        _.controllPlayButton();
      }

      _.touthMove();

      _.moveKeyboard();
    }
  }, {
    key: "setSliderSize",
    value: function setSliderSize() {
      var _ = this;

      _.width = _.slider.offsetWidth;
      _.sliderList.style.width = _.width * _.slideLength + _.gap * _.slideLength + 'px';
      _.sliderList.style.height = _.sliderItems[_.currentSlide].querySelector('.bolt-slider__content').offsetHeight + 'px';

      _.sliderItems.forEach(function (item) {
        item.style.width = _.width + 'px';

        if (_.gap) {
          item.style.marginRight = _.gap + 'px';
        }
      });
    }
  }, {
    key: "setPagination",
    value: function setPagination() {
      var _ = this;

      var count = _.loop ? _.slideLength - 2 : _.slideLength;

      var _loop = function _loop(i) {
        var btn = document.createElement(_.paginationTag);
        btn.classList.add(_.paginationClass);

        _.paginationWrap.appendChild(btn);

        if (_.paginationTag == 'button') {
          btn.ariaLabel = _.paginationAria + ' ' + (i + 1) + '.';
          btn.addEventListener('click', function () {
            _.currentSlide = _.loop ? i + 1 : i;

            _.sliderAnimation();

            _.moveSlider();
          });
        }

        _.paginations.push(btn);
      };

      for (var i = 0; i < count; i++) {
        _loop(i);
      }
    }
  }, {
    key: "moveNext",
    value: function moveNext() {
      var _ = this;

      _.sliderNext.addEventListener('click', function () {
        _.nextSlider();
      });
    }
  }, {
    key: "nextSlider",
    value: function nextSlider() {
      var _ = this;

      _.currentSlide++;

      if (_.currentSlide >= _.slideLength) {
        _.currentSlide = _.slideLength - 1;
      }

      if (_.loop && _.currentSlide >= _.slideLength - 1) {
        _.sliderAnimation();

        _.moveSlider();

        setTimeout(function () {
          _.currentSlide = 1;

          _.updateSlide();

          _.updateAriaLive();

          _.moveSlider();
        }, _.speed + 50);
        return;
      }

      _.sliderAnimation();

      _.moveSlider();
    }
  }, {
    key: "movePrew",
    value: function movePrew() {
      var _ = this;

      _.sliderPrew.addEventListener('click', function () {
        _.prewSlide();
      });
    }
  }, {
    key: "prewSlide",
    value: function prewSlide() {
      var _ = this;

      _.currentSlide--;
      console.log(_.currentSlide <= 1);

      if (_.loop && _.currentSlide <= 0) {
        _.sliderAnimation();

        _.moveSlider();

        setTimeout(function () {
          _.currentSlide = _.slideLength - 2;

          _.updateSlide();

          _.updateAriaLive();

          _.moveSlider();
        }, _.speed + 50);
        return;
      }

      if (_.currentSlide < 0) {
        _.currentSlide = 0;
      }

      _.sliderAnimation();

      _.moveSlider();
    }
  }, {
    key: "moveSlider",
    value: function moveSlider() {
      var _ = this;

      _.sliderList.style.transform = "translateX(-".concat(_.currentSlide * _.width + _.gap * _.currentSlide, "px)");
      _.sliderList.style.height = _.sliderItems[_.currentSlide].querySelector('.bolt-slider__content').offsetHeight + 'px';

      if (_.paginationWrap) {
        _.updatePagination();
      }

      if (_.sliderNext) {
        _.updateSlideNext();
      }

      if (_.sliderPrew) {
        _.updateSlidePrew();
      }
    }
  }, {
    key: "updateSlide",
    value: function updateSlide() {
      var _ = this;

      if (_.sliderList.querySelector('[tabindex="0"]')) {
        _.sliderList.querySelector('[tabindex="0"]').setAttribute('tabindex', -1);
      }

      _.sliderItems[_.currentSlide].classList.add('bolt-slider__item--active');

      _.sliderItems[_.currentSlide].setAttribute('tabindex', 0);
    }
  }, {
    key: "updateAriaLive",
    value: function updateAriaLive() {
      var _ = this;

      if (_.sliderList.querySelector('.bolt-slider__item[aria-live="polite"]')) {
        _.sliderList.querySelector('.bolt-slider__item[aria-live="polite"]').ariaLive = 'off';
      }

      if (!_.checkAutoPlay) {
        _.sliderItems[_.currentSlide].ariaLive = 'polite';
      }
    }
  }, {
    key: "updatePagination",
    value: function updatePagination() {
      var _ = this;

      if (_.paginationWrap.querySelector('.bolt-slider__pagination-btn--active')) {
        if (_.paginationTag == 'button') {
          _.paginationWrap.querySelector('.bolt-slider__pagination-btn--active').disabled = false;
        }

        _.paginationWrap.querySelector('.bolt-slider__pagination-btn--active').classList.remove(_.paginationClass + '--active');
      }

      if (_.loop) {
        if (_.currentSlide >= _.slideLength - 1) {
          _.paginations[0].disabled = true;

          _.paginations[0].classList.add(_.paginationClass + '--active');

          return;
        }

        if (_.currentSlide <= 0) {
          _.paginations[_.slideLength - 3].disabled = true;

          _.paginations[_.slideLength - 3].classList.add(_.paginationClass + '--active');

          return;
        }

        _.paginations[_.currentSlide - 1].disabled = true;

        _.paginations[_.currentSlide - 1].classList.add(_.paginationClass + '--active');
      } else {
        _.paginations[_.currentSlide].disabled = true;

        _.paginations[_.currentSlide].classList.add(_.paginationClass + '--active');
      }
    }
  }, {
    key: "updateSlideNext",
    value: function updateSlideNext() {
      var _ = this;

      if (_.sliderNext.disabled == true && _.currentSlide < _.slideLength - 1) {
        _.sliderNext.disabled = false;
      }

      if (_.currentSlide >= _.slideLength - 1) {
        _.sliderNext.disabled = true;
      }
    }
  }, {
    key: "updateSlidePrew",
    value: function updateSlidePrew() {
      var _ = this;

      if (_.sliderPrew.disabled == true && _.currentSlide > 0) {
        _.sliderPrew.disabled = false;
      }

      if (_.currentSlide <= 0) {
        _.sliderPrew.disabled = true;
      }
    }
  }, {
    key: "sliderAnimation",
    value: function sliderAnimation() {
      var _ = this;

      clearTimeout(_.timeOutAnimation);

      _.setAnimation();

      _.updateAriaLive();

      _.sliderItems.forEach(function (item) {
        item.classList.add('bolt-slider__item--active');
      });

      _.timeOutAnimation = setTimeout(function () {
        _.sliderItems.forEach(function (item) {
          item.classList.remove('bolt-slider__item--active');
        });

        _.removeAnimation();

        _.updateSlide();
      }, _.speed);
    }
  }, {
    key: "setAnimation",
    value: function setAnimation() {
      var _ = this;

      _.sliderList.style.transitionDuration = "".concat(_.speed, "ms, ").concat(_.speed, "ms");
    }
  }, {
    key: "removeAnimation",
    value: function removeAnimation() {
      var _ = this;

      _.sliderList.style.transitionDuration = "0ms, 0ms";
    }
  }, {
    key: "drawAutoPlay",
    value: function drawAutoPlay() {
      var _ = this;

      _.setIntervalAutoPlay = setInterval(function () {
        if (_.currentSlide == _.slideLength - 1) {
          _.currentSlide = -1;
        }

        _.nextSlider();
      }, _.autoplaySpeed);
    }
  }, {
    key: "pauseAutoPlay",
    value: function pauseAutoPlay() {
      var _ = this;

      clearInterval(_.setIntervalAutoPlay);
    }
  }, {
    key: "autoPlayControl",
    value: function autoPlayControl() {
      var _ = this;

      _.drawAutoPlay();

      var mouseover = _.slider.addEventListener('mouseover', function () {
        _.pauseAutoPlay();
      });

      var mouseout = _.slider.addEventListener('mouseout', function () {
        if (_.checkAutoPlay) {
          _.drawAutoPlay();
        }
      });

      var focusSlider = _.slider.addEventListener('keyup', function () {
        if (document.querySelector(':focus, :focus-visible')) {
          _.stopAutoPlay();
        }
      });

      var clickList = _.sliderList.addEventListener('click', function () {
        _.stopAutoPlay();
      });

      var clickNext = _.sliderNext.addEventListener('click', function () {
        _.stopAutoPlay();
      });

      var clickPrew = _.sliderPrew.addEventListener('click', function () {
        _.stopAutoPlay();
      });

      var clickPagination = _.paginationWrap.addEventListener('click', function () {
        _.stopAutoPlay();
      });
    }
  }, {
    key: "stopAutoPlay",
    value: function stopAutoPlay(mouseout, mouseover, clickList, clickNext, clickPrew, clickPagination, focusSlider) {
      var _ = this;

      _.pauseAutoPlay(mouseout, mouseover, clickList);

      _.checkAutoPlay = false;
      removeEventListener('mouseover', mouseover, false);
      removeEventListener('mouseout', mouseout, false);
      removeEventListener('click', clickList, false);
      removeEventListener('click', clickNext, false);
      removeEventListener('click', clickPrew, false);
      removeEventListener('click', clickPagination, false);
      removeEventListener('keyup', focusSlider, false);

      _.updateAriaLive();
    }
  }, {
    key: "controllPlayButton",
    value: function controllPlayButton() {
      var _ = this;

      _.playButton.classList.toggle(_.playClass + '--play');

      _.playButton.addEventListener('click', function () {
        _.playButton.classList.toggle(_.playClass + '--play');

        _.playButton.classList.toggle(_.playClass + '--paused');

        if (_.checkAutoPlay) {
          _.checkAutoPlay = false;

          _.stopAutoPlay();
        } else {
          _.checkAutoPlay = true;

          _.drawAutoPlay();
        }
      });
    }
  }, {
    key: "touthMove",
    value: function touthMove() {
      var _ = this;

      _.sliderList.addEventListener("touchstart", function (e) {
        if (_.checkAutoPlay) {
          _.stopAutoPlay();
        }

        _.startClientX = e.touches[0].clientX;

        _.sliderItems.forEach(function (slide) {
          slide.classList.add('bolt-slider__item--active');
        });
      });

      _.sliderList.addEventListener("touchmove", function (e) {
        _.touchMove = _.startClientX - e.touches[0].clientX;
      });

      _.sliderList.addEventListener("touchend", function () {
        if (_.touchMove < 30 && _.touchMove > -30) {
          _.sliderAnimation();

          _.moveSlider();
        }

        if (_.touchMove > 0) {
          _.nextSlider();
        }

        if (_.touchMove < 0) {
          _.prewSlide();
        }

        _.touchMove = 0;
      });
    }
  }, {
    key: "moveKeyboard",
    value: function moveKeyboard() {
      var _ = this;

      _.sliderList.addEventListener('keydown', function (e) {
        if (e.keyCode == 39) {
          _.nextSlide();
        }

        if (e.keyCode == 37) {
          _.prewSlide();
        }
      });
    }
  }, {
    key: "createLoop",
    value: function createLoop() {
      var _ = this;

      var firstSlide = _.sliderItems[0].cloneNode(true);

      var lastSlide = _.sliderItems[_.slideLength - 1].cloneNode(true);

      firstSlide.ariaHidden = true;
      lastSlide.ariaHidden = true;

      _.sliderList.append(firstSlide);

      _.sliderList.prepend(lastSlide);

      _.sliderItems.push(firstSlide);

      _.sliderItems.unshift(lastSlide);

      _.slideLength += 2;
    }
  }]);

  return BoltSlider;
}();