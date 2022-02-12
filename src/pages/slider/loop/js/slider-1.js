const slider1 = new BoltSlider({
	slider: '.slider-1',

	roledescription: 'слайдер',
	slideRoledescription: 'слайд',

	gap: 20,
	currentSlide: 1,
	speed: 500,

	loop: true,

	autoPlay: true,
	autoplaySpeed: 3000,
	playButton: '.play-1',

	sliderPrew: '.prew-1',
	sliderNext: '.next-1',

	paginationWrap: '.pagination-1',
	paginationTag: 'button',
	paginationClass: 'bolt-slider__pagination-btn',
	paginationAria: 'Показать слайд'
});
