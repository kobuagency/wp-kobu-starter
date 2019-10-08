'use strict';
module.exports = function( grunt ) {
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		banner: '/*!\n' +
				' * <%= pkg.themeName %> Version <%= pkg.version %> (<%= pkg.homepage %>)\n' +
				' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
				' */\n',
		themeheader: 	'/*\n' +
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
		watch : {
			sass : { // watch sass files
				files : ['assets/dev/styles/*.scss'],
				tasks : ['css_task']
			},
			css : { // livereload with min css update
				files : ['assets/dist/<%= pkg.functionPrefix %>.min.css'],
				options : {
					livereload : true
				}
			},
			js : { // watch js files
				files : ['assets/dev/scripts.js', 'assets/dev/ajax_filters.js'],
				tasks : ['js_task']
			},
			js_min : { // livereload with min js update
				files : ['assets/dist/<%= pkg.functionPrefix %>.min.js'],
				options : {
					livereload : true
				}
			},
			svg : {
				files : ['assets/dev/svg/**/*.svg'],
				tasks : ['svg_task']
			}
		},


		// Clean minified css and js
		clean: {
			css: {
				src: ['assets/dist/<%= pkg.functionPrefix %>.css', 'assets/dist/<%= pkg.functionPrefix %>.min.css', 'assets/dist/<%= pkg.functionPrefix %>.css.map']
			},
			js: {
				src: ['assets/dist/<%= pkg.functionPrefix %>.js', 'assets/dist/<%= pkg.functionPrefix %>.min.js']
			},
			pot: [
				'languages/<%= pkg.functionPrefix %>.pot'
			]
		},


		// Compile sass files into CSS

		sass: {
		    dist: {
		    	options: {
		    		sourcemap: 'none'
		    	},
			    files: {
			        'assets/dist/<%= pkg.functionPrefix %>.css': 'assets/dev/styles/style.scss'
			    }
		    }
		},



		// Apply post-processors to CSS - pixrem, autoprefixer, css-mqpacker and minify
		postcss: {
		    options: {
		    	map: false, // inline sourcemaps
		    	processors: [
		    		require('pixrem')(),
			        require('autoprefixer')({overrideBrowserslist: [
						'Android 2.3',
						'Android >= 4',
						'Chrome >= 20',
						'Firefox >= 24',
						'Explorer >= 8',
						'iOS >= 6',
						'Opera >= 12',
						'Safari >= 6'
					]}), // add vendor prefixes
			        require('css-mqpacker')({sort: require('sort-css-media-queries').desktopFirst}), // Pack media queries
			        require('cssnano')({preset: 'default'}) // minify the result
		    	]
		    },
		    dist: {
		     	src: 'assets/dist/<%= pkg.functionPrefix %>.css',
				dest: 'assets/dist/<%= pkg.functionPrefix %>.min.css'
		    }
		},
	

		// JsHint your javascript
		jshint : {
			all : ['assets/dev/scripts.js', 'assets/dev/ajax_filters.js'],
			options : {
				jshintrc: 'assets/dev/.jshintrc'
			}
		},


		// Uglify javascript

		concat: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: [
					'assets/dev/scripts.js'
				],
				dest: 'assets/dist/<%= pkg.functionPrefix %>.js'
			},
			ajax_filters: {
				src: [
					'assets/dev/ajax_filters.js'
				],
				dest: 'assets/dist/ajax_filters.js'
			}
		},


		uglify: {
			options: {
				preserveComments: 'some',
				report: 'min'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'assets/dist/<%= pkg.functionPrefix %>.min.js'
			},
			ajax_filters: {
				src: '<%= concat.ajax_filters.dest %>',
				dest: 'assets/dist/ajax_filters.min.js'
			}
		},


		usebanner: {
			options: {
				position: 'top',
				banner: '<%= banner %>'
			},
			files: {
				src: 'assets/dist/*.css'
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
					'search-form.php',
					'sidebar.php',
					'single.php',
					'page.php',
					'templates/*.php',
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
						'report-msgid-bugs-to': '<%= pkg.homepage %>',
						'x-generator': 'grunt-wp-i18n 0.4.5',
						'x-poedit-basepath': '.',
						'x-poedit-language': 'English',
						'x-poedit-country': 'UNITED STATES',
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
	});




	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-postcss' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-banner' );
	grunt.loadNpmTasks( 'grunt-svgmin' );
	grunt.loadNpmTasks( 'grunt-text-replace' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );


	// Default task
	grunt.registerTask( 'default', [
		'watch'
	]);

	// CSS task
	grunt.registerTask( 'css_task', [
		'clean:css',
		'sass',
		'postcss',
		'usebanner'
	]);

	// JS task
	grunt.registerTask( 'js_task', [
		'clean:js',
		'jshint',
		'concat',
		'uglify'
	]);

	// SVG task
	grunt.registerTask( 'svg_task', [
		'svgmin:dist'
	]);

	grunt.registerTask( 'translations', [
		'clean:pot',
		'makepot'
	]);


	// Build task
	grunt.registerTask( 'build', [
		'css_task',
		'js_task',
		'translations',
		'replace:dist'
	]);


	// Template Setup Task
	grunt.registerTask( 'setup', [
		'replace:init',
		'bower-install',
		'build'
	]);

	grunt.registerTask( 'bower-install', function() {
		var done = this.async();
		var bower = require( 'bower' ).commands;
		bower.install().on( 'end', function( data ) {
			done();
		}).on( 'data', function( data ) {
			console.log( data );
		}).on( 'error', function( err ) {
			console.error( err );
			done();
		});
	});
};

