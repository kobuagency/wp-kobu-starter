'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
			' * <%= pkg.themeName %> Version <%= pkg.version %> (<%= pkg.homepage %>)\n' +
			' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
			' */\n',
		themeheader: '/*\n' +
			'Theme Name: <%= pkg.themeName %>\n' +
			'Theme URI: <%= pkg.homepage %>\n' +
			'Author: <%= pkg.author.name %>\n' +
			'Author URI: <%= pkg.author.url %>\n' +
			'Description: <%= pkg.description %>\n' +
			'Version: <%= pkg.version %>\n' +
			'License: <%= pkg.license.name %>\n' +
			'License URI: <%= pkg.license.url %>\n' +
			'Text Domain: <%= pkg.functionPrefix %>\n' +
			'Domain Path: /languages/\n' +
			'Tags:\n' +
			'*/',

		// Watches for changes and runs tasks
		watch: {
			sass: { // watch sass files
				files: ['assets/dev/styles/*.scss', 'assets/dev/styles/*/*.scss', 'inc/gutenberg-files/editor-styles.scss'],
				tasks: ['css_task']
			},
			css: { // livereload with min css update
				files: ['assets/dist/*.min.css'],
				options: {
					livereload: true
				}
				/* SSL options
				options: {
					livereload: {
						key: grunt.file.read('/Applications/MAMP/Library/OpenSSL/certs/www.heartgenetics.test.key'),
						cert: grunt.file.read('/Applications/MAMP/Library/OpenSSL/certs/www.heartgenetics.test.crt'),
					},
				},
				*/
			},
			js: { // watch js files
				files: ['assets/dev/scripts/*.js'],
				tasks: ['js_task']
			},
			js_min: { // livereload with min js update
				files: ['assets/dist/*.min.js'],
				options: {
					livereload: true
				}
				/* SSL options
				options: {
					livereload: {
						key: grunt.file.read('/Applications/MAMP/Library/OpenSSL/certs/www.heartgenetics.test.key'),
						cert: grunt.file.read('/Applications/MAMP/Library/OpenSSL/certs/www.heartgenetics.test.crt'),
					},
				},
				*/
			},
			svg: {
				files: ['assets/dev/svg/**/*.svg'],
				tasks: ['svg_task']
			}
		},


		// Clean dist files
		clean: {
			css: {
				src: ['assets/dist/*.css', 'assets/dist/*.css.map']
			},
			critical: {
				src: ['assets/dist/critical/*.css']
			},
			js: {
				src: ['assets/dist/*.min.js']
			},
			pot: [
				'languages/<%= pkg.functionPrefix %>.pot'
			]
		},


		// Compile sass files into CSS

		sass: {
			dist: {
				options: {
					implementation: require('sass'),
					sourcemap: 'none'
				},
				files: {
					'assets/dist/<%= pkg.functionPrefix %>.css': 'assets/dev/styles/style.scss',
					'assets/dist/<%= pkg.functionPrefix %>_nojs.css': 'assets/dev/styles/no_js.scss',
					'inc/gutenberg-files/editor-styles.css': 'inc/gutenberg-files/editor-styles.scss',
				}
			}
		},


		// Apply post-processors to CSS - autoprefixer, css-mqpacker and minify
		postcss: {
			options: {
				map: false, // inline sourcemaps
				processors: [
					require('autoprefixer')(), // add vendor prefixes
					require('css-mqpacker')({ sort: require('sort-css-media-queries').desktopFirst }), // Pack media queries
					require('cssnano')({ preset: 'default' }) // minify the result
				]
			},
			dist: {
				files: {
					'assets/dist/<%= pkg.functionPrefix %>.min.css': 'assets/dist/<%= pkg.functionPrefix %>.css',
					'assets/dist/<%= pkg.functionPrefix %>_nojs.min.css': 'assets/dist/<%= pkg.functionPrefix %>_nojs.css',
					'inc/gutenberg-files/editor-styles.min.css': 'inc/gutenberg-files/editor-styles.css',
				}
			}
		},


		// JsHint your javascript
		jshint: {
			all: ['assets/dev/scripts/*.js'],
			options: {
				jshintrc: 'assets/dev/scripts/.jshintrc'
			}
		},


		// Uglify javascript

		uglify: {
			options: {
				preserveComments: 'some',
				report: 'min'
			},
			dist: {
				files: {
					'assets/dist/video.min.js': ['assets/dev/scripts/video.js'],
					'assets/dist/<%= pkg.functionPrefix %>.min.js': ['assets/dev/scripts/scripts.js'],
					'assets/dist/intersectionObserver.min.js': ['assets/dev/scripts/intersectionObserver.js'],
				}
			}
		},

		concat: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: [
					'assets/dist/*.min.js',
					'!assets/dist/intersectionObserver.min.js'
				],
				dest: 'assets/dist/<%= pkg.functionPrefix %>_scripts.min.js'
			}
		},

		usebanner: {
			css: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: 'assets/dist/*.css'
				}
			},
			js: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: 'assets/dist/intersectionObserver.min.js'
				}
			}
		},

		// SVG min
		svgmin: {
			options: {
				plugins: [
					{ convertPathData: false }, // breaks paths
					{ mergePaths: false }, // breaks paths
					{ removeUnknownsAndDefaults: false }, // breaks colors
					{ removeViewBox: false },
					{ removeUselessStrokeAndFill: false },
					{ removeAttrs: { attrs: ['id', 'data-name'] } }
				]
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'assets/dev/svg/',
						src: '*.svg',
						dest: 'assets/images/',
						ext: '.svg',
						extDot: 'first'
					}
				]
			}
		},


		replace: {
			dist: {
				src: ['style.css'],
				overwrite: true,
				replacements: [{
					from: /((?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:\/\/.*))/,
					to: '<%= themeheader %>'
				}]
			},
			init: {
				src: [
					'bower.json',
					'inc/components/*.php',
					'inc/*.php',
					'404.php',
					'archive.php',
					'author.php',
					'comments.php',
					'content-none.php',
					'content.php',
					'footer.php',
					'functions.php',
					'header.php',
					'index.php',
					'search.php',
					'searchform.php',
					'sidebar.php',
					'single.php',
					'page.php',
					'templates/*.php',
					'assets/dev/styles/abstracts/_variables.scss',
				],
				overwrite: true,
				replacements: [{
					from: 'MyWPTheme',
					to: '<%= pkg.classPrefix %>'
				}, {
					from: 'MYWPTHEME',
					to: '<%= pkg.constantPrefix %>'
				}, {
					from: 'mywptheme',
					to: '<%= pkg.functionPrefix %>'
				}]
			}
		},


		makepot: {
			dist: {
				options: {
					domainPath: '/languages',
					potComments: 'Copyright (c) 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>',
					potFilename: '<%= pkg.functionPrefix %>.pot',
					potHeaders: {
						'x-generator': 'grunt-wp-i18n 0.4.5',
						'x-poedit-basepath': '.',
						'x-poedit-language': 'Portuguese',
						'x-poedit-country': 'Portugal',
						'x-poedit-sourcecharset': 'uft-8',
						'x-poedit-keywordslist': '__;_e;_x:1,2c;_ex:1,2c;_n:1,2; _nx:1,2,4c;_n_noop:1,2;_nx_noop:1,2,3c;esc_attr__; esc_html__;esc_attr_e; esc_html_e;esc_attr_x:1,2c; esc_html_x:1,2c;',
						'x-poedit-bookmars': '',
						'x-poedit-searchpath-0': '.',
						'x-textdomain-support': 'yes'
					},
					type: 'wp-theme'
				}
			}
		},


		critical: {
			options: {
				base: './',
				css: [
					'assets/dist/<%= pkg.functionPrefix %>.css'
				],
				width: 1920,
				height: 1080
			},
			homepage: {
				src: '<%= pkg.localUrl %>',
				dest: 'assets/dist/critical/<%= pkg.functionPrefix %>_critical_homepage.min.css'
			},
			default_page: {
				src: '<%= pkg.localUrl %>/ilga-europe/work-with-us/',
				dest: 'assets/dist/critical/<%= pkg.functionPrefix %>_critical_default_page.min.css'
			},
		}
	});



	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('@lodder/grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-wp-i18n');
	grunt.loadNpmTasks('grunt-critical');

	// Default task
	grunt.registerTask('default', [
		'watch'
	]);

	// CSS task
	grunt.registerTask('css_task', [
		'clean:css',
		'newer:sass',
		'newer:postcss',
		'usebanner:css'
	]);

	// JS task
	grunt.registerTask('js_task', [
		'clean:js',
		'newer:jshint',
		'newer:uglify',
		'concat',
		'usebanner:js'
	]);

	// SVG task
	grunt.registerTask('svg_task', [
		'newer:svgmin:dist'
	]);

	grunt.registerTask('translations', [
		'clean:pot',
		'makepot'
	]);

	// Build task
	grunt.registerTask('build', [
		'css_task',
		'js_task',
		'clean:critical',
		'critical',
		'translations',
		'replace:dist'
	]);

	// Template Setup Task
	grunt.registerTask('setup', [
		'replace:init',
		'bower-install',
		'build'
	]);

	grunt.registerTask('bower-install', function () {
		var done = this.async();
		var bower = require('bower').commands;
		bower.install().on('end', function (data) {
			done();
		}).on('data', function (data) {
			console.log(data);
		}).on('error', function (err) {
			console.error(err);
			done();
		});
	});
};

