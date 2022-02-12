/*! https://github.com/uzinok/bolt-slider */

class BoltSlider {

	constructor(options) {
		const _ = this;

		// errors user options
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
		}

		// user options
		_.slider = document.querySelector(options.slider);

		_.roledescription = options.roledescription || 'carousel';
		_.slideRoledescription = options.slideRoledescription || 'slide';

		_.gap = options.gap || 0;
		_.currentSlide = options.currentSlide || 0;
		_.speed = options.speed || 300;

		_.loop = options.loop || false;

		_.autoPlay = options.autoPlay || false;
		_.autoplaySpeed = options.autoplaySpeed || 0;
		// playClass for slider options
		_.playClass = options.playButton || false;
		_.playButton = document.querySelector(options.playButton);

		_.sliderPrew = document.querySelector(options.sliderPrew) || false;
		_.sliderNext = document.querySelector(options.sliderNext) || false;

		_.paginationWrap = document.querySelector(options.paginationWrap) || false;
		_.paginationTag = options.paginationTag || 'span';
		_.paginationClass = options.paginationClass || 'bolt-slider__paginaton-btn';
		_.paginationAria = options.paginationAria || 'Go to slide';

		// errors slider options
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
		}

		// slider options
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
		}

		// init slider
		_.sliderInit();
	}

	sliderInit() {
		const _ = this;

		_.slider.classList.remove('bolt-no-js');
		_.slider.setAttribute('aria-roledescription', _.roledescription);

		if (_.loop) {
			_.createLoop();
		}

		for (let i = 0; i < _.slideLength; i++) {
			_.sliderItems[i].ariaLive = 'off';
			_.sliderItems[i].setAttribute('aria-roledescription', _.slideRoledescription);
			_.sliderItems[i].setAttribute('tabindex', -1);
		}

		_.setSliderSize();
		window.addEventListener('resize', () => {
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

	setSliderSize() {
		const _ = this;

		_.width = _.slider.offsetWidth;
		_.sliderList.style.width = (_.width * _.slideLength) + (_.gap * _.slideLength) + 'px';
		_.sliderList.style.height = _.sliderItems[_.currentSlide].querySelector('.bolt-slider__content').offsetHeight + 'px';

		_.sliderItems.forEach(item => {
			item.style.width = _.width + 'px';

			if (_.gap) {
				item.style.marginRight = _.gap + 'px';
			}
		});
	}

	setPagination() {
		const _ = this;

		const count = _.loop ? _.slideLength - 2 : _.slideLength;

		for (let i = 0; i < count; i++) {
			let btn = document.createElement(_.paginationTag);
			btn.classList.add(_.paginationClass);

			_.paginationWrap.appendChild(btn);

			if (_.paginationTag == 'button') {
				btn.ariaLabel = _.paginationAria + ' ' + (i + 1) + '.';
				btn.addEventListener('click', () => {
					_.currentSlide = _.loop ? i + 1 : i;

					_.sliderAnimation();
					_.moveSlider();
				});

			}
			_.paginations.push(btn);

		}
	}

	moveNext() {
		const _ = this;

		_.sliderNext.addEventListener('click', () => {
			_.nextSlider();
		})
	}

	nextSlider() {
		const _ = this;

		_.currentSlide++;

		if (_.currentSlide >= _.slideLength) {
			_.currentSlide = _.slideLength - 1;
		}

		if (_.loop && _.currentSlide >= _.slideLength - 1) {

			_.sliderAnimation();
			_.moveSlider();

			setTimeout(() => {
				_.currentSlide = 1;
				_.updateSlide();
				_.updateAriaLive();
				_.moveSlider();
			}, (_.speed + 50));

			return;
		}

		_.sliderAnimation();
		_.moveSlider();
	}

	movePrew() {
		const _ = this;

		_.sliderPrew.addEventListener('click', () => {
			_.prewSlide();
		})
	}

	prewSlide() {
		let _ = this;

		_.currentSlide--;
		console.log(_.currentSlide <= 1);
		if (_.loop && _.currentSlide <= 0) {

			_.sliderAnimation();
			_.moveSlider();

			setTimeout(() => {
				_.currentSlide = _.slideLength - 2;
				_.updateSlide();
				_.updateAriaLive();
				_.moveSlider();
			}, (_.speed + 50));

			return;
		}

		if (_.currentSlide < 0) {
			_.currentSlide = 0;
		}

		_.sliderAnimation();
		_.moveSlider();
	}

	moveSlider() {
		const _ = this;

		_.sliderList.style.transform = `translateX(-${(_.currentSlide * _.width) + (_.gap * _.currentSlide)}px)`;
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

	updateSlide() {
		const _ = this;

		if (_.sliderList.querySelector('[tabindex="0"]')) {
			_.sliderList.querySelector('[tabindex="0"]').setAttribute('tabindex', -1);
		}

		_.sliderItems[_.currentSlide].classList.add('bolt-slider__item--active');
		_.sliderItems[_.currentSlide].setAttribute('tabindex', 0);
	}

	updateAriaLive() {
		const _ = this;

		if (_.sliderList.querySelector('.bolt-slider__item[aria-live="polite"]')) {
			_.sliderList.querySelector('.bolt-slider__item[aria-live="polite"]').ariaLive = 'off';
		}
		if (!_.checkAutoPlay) {
			_.sliderItems[_.currentSlide].ariaLive = 'polite';
		}
	}

	updatePagination() {
		const _ = this;

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

	updateSlideNext() {
		const _ = this;

		if (_.sliderNext.disabled == true && _.currentSlide < _.slideLength - 1) {
			_.sliderNext.disabled = false;
		}
		if (_.currentSlide >= _.slideLength - 1) {
			_.sliderNext.disabled = true;
		}
	}

	updateSlidePrew() {
		const _ = this;
		if (_.sliderPrew.disabled == true && _.currentSlide > 0) {
			_.sliderPrew.disabled = false;
		}
		if (_.currentSlide <= 0) {
			_.sliderPrew.disabled = true;
		}
	}

	sliderAnimation() {
		const _ = this;

		clearTimeout(_.timeOutAnimation);

		_.setAnimation();
		_.updateAriaLive();
		_.sliderItems.forEach(item => {
			item.classList.add('bolt-slider__item--active');
		});

		_.timeOutAnimation = setTimeout(() => {
			_.sliderItems.forEach(item => {
				item.classList.remove('bolt-slider__item--active');
			});
			_.removeAnimation();
			_.updateSlide();
		}, _.speed)
	}

	setAnimation() {
		const _ = this;

		_.sliderList.style.transitionDuration = `${_.speed}ms, ${_.speed}ms`;
	}

	removeAnimation() {
		const _ = this;

		_.sliderList.style.transitionDuration = `0ms, 0ms`;
	}

	drawAutoPlay() {
		const _ = this;

		_.setIntervalAutoPlay = setInterval(() => {

			if (_.currentSlide == _.slideLength - 1) {
				_.currentSlide = -1;
			}

			_.nextSlider();
		}, _.autoplaySpeed);
	}

	pauseAutoPlay() {
		const _ = this;

		clearInterval(_.setIntervalAutoPlay);
	}

	autoPlayControl() {
		const _ = this;

		_.drawAutoPlay();

		const mouseover = _.slider.addEventListener('mouseover', () => {
			_.pauseAutoPlay();
		});

		const mouseout = _.slider.addEventListener('mouseout', () => {
			if (_.checkAutoPlay) {
				_.drawAutoPlay();
			}
		});

		const focusSlider = _.slider.addEventListener('keyup', () => {
			if (document.querySelector(':focus, :focus-visible')) {
				_.stopAutoPlay();
			}
		})

		const clickList = _.sliderList.addEventListener('click', () => {
			_.stopAutoPlay();
		});
		const clickNext = _.sliderNext.addEventListener('click', () => {
			_.stopAutoPlay();
		});
		const clickPrew = _.sliderPrew.addEventListener('click', () => {
			_.stopAutoPlay();
		});
		const clickPagination = _.paginationWrap.addEventListener('click', () => {
			_.stopAutoPlay();
		});

	}

	stopAutoPlay(mouseout, mouseover, clickList, clickNext, clickPrew, clickPagination, focusSlider) {
		const _ = this;

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

	controllPlayButton() {
		let _ = this;
		_.playButton.classList.toggle(_.playClass + '--play');

		_.playButton.addEventListener('click', () => {
			_.playButton.classList.toggle(_.playClass + '--play');
			_.playButton.classList.toggle(_.playClass + '--paused');

			if (_.checkAutoPlay) {
				_.checkAutoPlay = false;
				_.stopAutoPlay();
			} else {
				_.checkAutoPlay = true;
				_.drawAutoPlay();
			}
		})
	}

	touthMove() {
		let _ = this;

		_.sliderList.addEventListener("touchstart", (e) => {
			if (_.checkAutoPlay) {
				_.stopAutoPlay();
			}
			_.startClientX = e.touches[0].clientX;

			_.sliderItems.forEach(slide => {
				slide.classList.add('bolt-slider__item--active');
			});
		})

		_.sliderList.addEventListener("touchmove", (e) => {
			_.touchMove = _.startClientX - e.touches[0].clientX;

		});

		_.sliderList.addEventListener("touchend", () => {

			if ((_.touchMove < 30) && _.touchMove > -30) {
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
		})

	}

	moveKeyboard() {
		let _ = this;

		_.sliderList.addEventListener('keydown', e => {

			if (e.keyCode == 39) {
				_.nextSlide();
			}

			if (e.keyCode == 37) {
				_.prewSlide();
			}
		});
	}

	createLoop() {
		const _ = this;

		const firstSlide = _.sliderItems[0].cloneNode(true);
		const lastSlide = _.sliderItems[_.slideLength - 1].cloneNode(true);

		firstSlide.ariaHidden = true;
		lastSlide.ariaHidden = true;

		_.sliderList.append(firstSlide);
		_.sliderList.prepend(lastSlide);

		_.sliderItems.push(firstSlide);
		_.sliderItems.unshift(lastSlide);

		_.slideLength += 2;
	}

}
