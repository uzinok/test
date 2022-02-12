const {
	src,
	dest,
	parallel,
	series,
	watch
} = require('gulp');
// clean
const del = require('del');
// less
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
// html
const pug = require("gulp-pug");
// js
const babel = require('gulp-babel');
const minify = require('gulp-minify');
// browserSync
const browserSync = require('browser-sync').create();
// error
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

/**
 * clean
 */
const clean = () => {
	return del('build');
}
exports.clean = clean;

/**
 * copy
 */
const copy = () => {
	return src([
			'src/img/*.+(png|jpg|svg|webp|ico|gif|JPG)*',
			'src/favicon.ico',
		], {
			base: 'src'
		})
		.pipe(dest('build'));
}
exports.copy = copy;

/**
 * less
 */
const lessToCss = () => {
	return src(['src/pages/css/style.less', 'src/pages/slider/**/css/bolt-slider.less'], {
			base: 'src/pages'
		})
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Less',
					message: err.message
				}
			})
		}))
		.pipe(less())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ['last 5 versions']
		}))
		.pipe(csso())
		.pipe(dest('build'))
		.pipe(browserSync.stream());
}
exports.lessToCss = lessToCss;

/**
 * html
 */
const htmlTo = () => {
	return src(["src/pages/index.pug", "src/pages/slider/**/index.pug"], {
			base: 'src/pages'
		})
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: "Pug",
					message: err.message
				}
			})
		}))
		.pipe(pug())
		.pipe(dest('build'))
		.pipe(browserSync.stream());
}
exports.htmlTo = htmlTo;

const scripts = () => {
	return src('src/pages/slider/**/js/bolt-slider.js', {
			base: 'src/pages'
		})
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'js',
					message: err.message
				}
			})
		}))
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(minify({
			ext: {
				src: '.js',
				min: '.min.js'
			},
			exclude: ['tasks']
		}))
		.pipe(dest('build/'))
		.pipe(browserSync.stream());
}
exports.scripts = scripts;

/**
 * browserSync
 */
const server = () => {
	browserSync.init({
		server: {
			baseDir: './build/'
		}
	});

	watch(['src/pages/css/style.less', 'src/pages/slider/**/css/bolt-slider.less'], lessToCss);
	watch(["src/pages/index.pug", "src/pages/**/*.pug"], htmlTo);
	watch('src/pages/slider/**/js/bolt-slider.js', scripts);
	watch('src/pages/**/js/*.js', htmlTo);
}
exports.server = server;

/**
 * default
 */
exports.default = series(clean, parallel(copy, lessToCss, scripts, htmlTo), server);
