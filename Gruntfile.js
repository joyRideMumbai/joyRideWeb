'use strict';

var request = require('request');
var fs      = require('fs');
var jslist  = [];
var csslist = [];

module.exports = function (grunt) {
	// show elapsed time at the end
	require('time-grunt')(grunt);
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	var reloadPort = 35729,
		files;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		develop: {
			server: {
				file: 'app.js'
			}
		},
		sass: {
			dist: {
				files: {
					'public/css/master.css': 'public/css/master.scss',
					'public/css/static.css': 'public/css/static.scss',
					'public/css/ride.css': 'public/css/ride.scss'
				}
			}
		},
		protractor: {
			options: {
				configFile: "public/tests/protractor-conf.js", // Default config file
				keepAlive: true, // If false, the grunt process stops when the test fails.
				noColor: false, // If true, protractor will not use colors in its output.
				args: {
					// Arguments passed to the command
				}
			},
			all: {},
		},
		protractor_webdriver: {
			options: {
				// Task-specific options go here.
			},
			all: {},
		},
		concat: {
			options: {},
			dist: {
				src: [
					'public/components/selectize/dist/js/standalone/selectize.js',
					'public/components/masonry/dist/masonry.pkgd.js',
					'public/components/messenger/build/js/messenger.js',
					'public/components/messenger/build/js/messenger-theme-flat.js',
					'public/components/magnific-popup/dist/jquery.magnific-popup.js',
					'public/components/animatedmodal/animatedModal.js'
				],
				dest: 'public/jslib1/distjs.js'
			},
			js: {
				src: [
					'public/js/afterinit.js',
					'public/js/app.js',
					'public/js/ride.js',
					'public/js/auth/auth.js',
					'public/js/triggs/trig.js',
					'public/js/msgs/msgs.js',
					'public/js/vendor/vendor.js',
					'public/js/trial/trial.js',
					'public/js/search/search.js',
					'public/js/profile/profile.js',
					'public/js/article/article.js',
					'public/js/membership/membership.js',
					'public/js/branding/branding.js',
					'public/js/landing/fitnessguide.js',
					'public/js/landing/landingpage.js',
					'public/js/campaign/campaign.js',
					'public/js/globalsearch/globalsearch.js'
				],
				dest: 'public/jslib2/assestsjs.js'
			},
			initjs: {
				src: ['public/components/jquery/dist/jquery.js',
					  'public/components/fakeLoader/fakeLoader.js',
					  'public/components/jquery_lazyload/jquery.lazyload.js',
					  'public/js/init.js'
				],
				dest: 'public/jslib3/initlib.js'
			},
			cssdist: {
				src: [
					'public/components/fakeLoader/fakeLoader.css',
					'public/components/selectize/dist/css/selectize.default.css',
					'public/components/angular-material/angular-material.css',
					'public/components/animate.css/animate.css',
					'public/components/magnific-popup/dist/magnific-popup.css',
					'public/components/messenger/build/css/messenger.css',
					'public/components/messenger/build/css/messenger-theme-flat.css',
					'public/components/v-accordion/dist/v-accordion.css',
				],
				dest: 'public/csslib1/distcss.css'
			},
			cssassets: {
				src: ['public/css/ride.css'],
				dest: 'public/csslib2/assestscss.css'
			}
		},
		uglify: {
			options: {
				report: 'gzip'
			},
			build: {
				files: {
					'public/jslib1/distjs.min.js': ['public/jslib1/distjs.js'],
					'public/jslib2/assestsjs.min.js': ['public/jslib2/assestsjs.js'],
					'public/jslib3/initlib.min.js': ['public/jslib3/initlib.js']
				}
			}
		},
		cssmin: {
			options: {
				report: 'gzip',
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: [{
					'public/csslib2/assestscss.min.css': ['public/csslib2/assestscss.css']
				}, {
					'public/csslib1/distcss.min.css': ['public/csslib1/distcss.css']
				}]
			}
		},
		compress: {
			main: {
				options: {
					mode: 'gzip',
					level: 9
				},
				files: [{
					expand: true,
					src: ['public/jslib1/distjs.min.js'],
					ext: '.js'
				}, {
					expand: true,
					src: ['public/jslib2/assestsjs.min.js'],
					ext: '.js'
				}, {
					expand: true,
					src: ['public/jslib3/initlib.min.js'],
					ext: '.js'
				}, {
					expand: true,
					src: ['public/csslib2/assestscss.min.css'],
					ext: '.css'
				}, {
					expand: true,
					src: ['public/csslib1/distcss.min.css'],
					ext: '.css'
				}]
			}
		},
		assets_versioning: {
			options: {
				tag: 'hash',
				hashLength: 6
			},
			build_target: {
				options: {
					tasks: ['compress:main']
				}
			},
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			files: ['public/js/**/*.js']
		},
		watch: {
			options: {
				nospawn: true,
				livereload: reloadPort
			},
			js: {
				files: [
					'app.js',
					'app/**/*.js',
					'config/*.js',
					// 'public/**/*.js'
				],
				tasks: ['develop', 'delayed-livereload']
			},
			css: {
				files: [
					'public/css/*.scss'
				],
				tasks: ['sass'],
				options: {
					livereload: reloadPort
				}
			},
			views: {
				files: [
					'app/views/*.jade',
					'app/views/**/*.jade'
				],
				options: {
					livereload: reloadPort
				}
			}
		},
		clean: {
			yourTarget: {

				src: ['public/csslib2/assestscss.css', 'public/csslib2/assestscss.min.css', 'public/csslib1/distcss.css', 'public/csslib1/distcss.min.css',
					  'public/jslib2/assestsjs.js', 'public/jslib2/assestsjs.min.js', 'public/jslib1/distjs.js', 'public/jslib1/distjs.min.js', 'public/jslib3/initlib.js', 'public/jslib3/initlib.min.js'
				]
			}
		},
		// Read the file
		aws_s3: {
			options: {
				accessKeyId: 'AKIAIRQP65VEX5N23QRQ', // Use the variables
				secretAccessKey: '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', // You can also use env variables
				region: 'ap-southeast-1',
				bucket: 'cdn.fitn.in',
				uploadConcurrency: 5, // 5 simultaneous uploads
				downloadConcurrency: 5 // 5 simultaneous downloads
			},
			productionjs: {
				options: {
					params: {
						ContentEncoding: 'gzip',
						ContentType: 'application/javascript', // applies to all the files!
						Expires: 1601449626
					}
				},
				files: [{
					expand: true,
					cwd: 'public/jslib1',
					src: ['**'],
					dest: 'assets/',
					action: 'upload'
				}, {
					expand: true,
					cwd: 'public/jslib2',
					src: ['**'],
					dest: 'assets/',
					action: 'upload'
				}, {
					expand: true,
					cwd: 'public/jslib3',
					src: ['**'],
					dest: 'assets/',
					action: 'upload'
				}]
			},
			productioncss: {
				options: {
					params: {
						ContentEncoding: 'gzip',
						ContentType: 'text/css', // applies to all the files!
						Expires: 1601449626
					}
				},
				files: [{
					expand: true,
					cwd: 'public/csslib1',
					src: ['**'],
					dest: 'assets/',
					action: 'upload'
				}, {
					expand: true,
					cwd: 'public/csslib2',
					src: ['**'],
					dest: 'assets/',
					action: 'upload'
				}]
			}
		},
		removelogging: {
			dist: {
				src: "public/js/**/*.js" // Each file will be overwritten with the output!
			}
		}
	});
	grunt.registerTask('updatelocal1', 'async list', function () {
		var fs = require("fs");
		(function walk(path) {
			var jsfiles1 = fs.readdirSync(path);
			fs.unlinkSync('app/views/libs.jade');
			var line1 = 'block append js';
			var line2 = '   script(defer src="https://cdn.fitn.in/assets/' + jsfiles1[0] + '"' + ')';
			var fd = fs.openSync("app/views/libs.jade", 'w');
			grunt.log.writeln(fd);
			fs.writeSync(fd, line1 + '\n', null, null, null);
			fs.writeSync(fd, line2, null, null, null);
			grunt.log.writeln('file libs.jade successfully edit to contain compressed files');
		})('public/jslib1');
	});
	grunt.registerTask('updatelocal2', 'async list', function () {
		var fs = require("fs");
		(function walk(path) {
			var jsfiles2 = fs.readdirSync(path);
			fs.unlinkSync('app/views/assets.jade');
			var line1 = 'block append js';
			var line2 = '   script(defer src="https://cdn.fitn.in/assets/' + jsfiles2[0] + '"' + ')';
			var fd = fs.openSync("app/views/assets.jade", 'w');
			fs.writeSync(fd, line1 + '\n', null, null, null);
			fs.writeSync(fd, line2, null, null, null);
			grunt.log.writeln('file assets.jade successfully edit to contain compressed files');
		})('public/jslib2');
	});
	grunt.registerTask('updatelocal3', 'async list', function () {
		var fs = require("fs");
		(function walk(path) {
			var jsfiles3 = fs.readdirSync(path);
			fs.unlinkSync('app/views/init.jade');
			var line1 = 'block js';
			var line2 = '   script(defer src="https://cdn.fitn.in/assets/' + jsfiles3[0] + '"' + ')';
			var fd = fs.openSync("app/views/init.jade", 'w');
			grunt.log.writeln(fd);
			fs.writeSync(fd, line1 + '\n', null, null, null);
			fs.writeSync(fd, line2, null, null, null);
			grunt.log.writeln('file init.jade successfully edit to contain compressed files');
		})('public/jslib3');
	});
	grunt.registerTask('updatelocal4', 'async list', function () {
		var fs = require("fs");
		(function walk(path) {
			var cssfiles1 = fs.readdirSync(path);
			fs.unlinkSync('app/views/csslibs.jade');
			var line1 = 'link(rel="stylesheet", href="https://cdn.fitn.in/assets/' + cssfiles1[0] + '",type="text/css")';
			var fd = fs.openSync("app/views/csslibs.jade", 'w');
			grunt.log.writeln(fd);
			fs.writeSync(fd, line1, null, null, null);
			grunt.log.writeln('file csslibs.jade successfully edit to contain compressed files');
		})('public/csslib1');
	});
	grunt.registerTask('updatelocal5', 'async list', function () {
		var fs = require("fs");
		(function walk(path) {
			var cssfiles2 = fs.readdirSync(path);
			fs.unlinkSync('app/views/csssource.jade');
			var line1 = 'link(rel="stylesheet", href="https://cdn.fitn.in/assets/' + cssfiles2[0] + '",type="text/css")';
			var fd = fs.openSync("app/views/csssource.jade", 'w');
			grunt.log.writeln(fd);
			fs.writeSync(fd, line1, null, null, null);
			grunt.log.writeln('file csssource.jade successfully edit to contain compressed files');
		})('public/csslib2');
	});
	grunt.registerTask('updatesrc', 'async list', function () {
		{
			var fs = require("fs");
			(function walk(path) {
				var jsfiles1 = fs.readdirSync(path);
				fs.unlink('app/views/libs.jade');
				var line1 = 'block append js';
				var line2 = '   script(defer src="https://cdn.fitn.in/assets/' + jsfiles1[0] + '"' + ')';
				var fd = fs.openSync("app/views/libs.jade", 'w');
				grunt.log.writeln(fd);
				fs.writeSync(fd, line1 + '\n', null, null, null);
				fs.writeSync(fd, line2, null, null, null);
				grunt.log.writeln('file libs.jade successfully edit to contain compressed files');
			})('public/jslib1');

			(function walk(path) {
				var jsfiles2 = fs.readdirSync(path);
				fs.unlink('app/views/assets.jade');
				var line1 = 'block append js';
				var line2 = '   script(defer src="https://cdn.fitn.in/assets/' + jsfiles2[0] + '"' + ')';
				var fd = fs.openSync("app/views/assets.jade", 'w');
				fs.writeSync(fd, line1 + '\n', null, null, null);
				fs.writeSync(fd, line2, null, null, null);
				grunt.log.writeln('file assets.jade successfully edit to contain compressed files');
			})('public/jslib2');

			(function walk(path) {
				var jsfiles3 = fs.readdirSync(path);
				fs.unlink('app/views/init.jade');
				var line1 = 'block js';
				var line2 = '   script(defer src="https://cdn.fitn.in/assets/' + jsfiles3[0] + '"' + ')';
				var fd = fs.openSync("app/views/init.jade", 'w');
				grunt.log.writeln(fd);
				fs.writeSync(fd, line1 + '\n', null, null, null);
				fs.writeSync(fd, line2, null, null, null);
				grunt.log.writeln('file init.jade successfully edit to contain compressed files');
			})('public/jslib3');

			(function walk(path) {
				var cssfiles1 = fs.readdirSync(path);
				fs.unlink('app/views/csslibs.jade');
				var line1 = 'link(rel="stylesheet", href="https://cdn.fitn.in/assets/' + cssfiles1[0] + '",type="text/css")';
				var fd = fs.openSync("app/views/csslibs.jade", 'w');
				grunt.log.writeln(fd);
				fs.writeSync(fd, line1, null, null, null);
				grunt.log.writeln('file csslibs.jade successfully edit to contain compressed files');
			})('public/csslib1');

			(function walk(path) {
				var cssfiles2 = fs.readdirSync(path);
				fs.unlink('app/views/csssource.jade');
				var line1 = 'link(rel="stylesheet", href="https://cdn.fitn.in/assets/' + cssfiles2[0] + '",type="text/css")';
				var fd = fs.openSync("app/views/csssource.jade", 'w');
				grunt.log.writeln(fd);
				fs.writeSync(fd, line1, null, null, null);
				grunt.log.writeln('file csssource.jade successfully edit to contain compressed files');
			})('public/csslib2');
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-assets-versioning');
	grunt.loadNpmTasks('grunt-aws-s3');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.config.requires('watch.js.files');
	files = grunt.config('watch.js.files');
	files = grunt.file.expand(files);
	//config = grunt.file.readJSON('goldenconfiguration.json');

	grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
		var done = this.async();
		setTimeout(function () {
			request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','), function (err, res) {
				var reloaded = !err && res.statusCode === 200;
				if (reloaded)
					grunt.log.ok('Delayed live reload successful.');
				else
					grunt.log.error('Unable to make a delayed live reload.');
				done(reloaded);
			});
		}, 500);
	});

	grunt.registerTask('default', [
		'sass',
		'develop',
		'jshint:files',
		'watch'
	]);

	grunt.registerTask('golden', [
		'sass',
		'develop',
		'removelogging',
		'jshint:files',
		'concat',
		'uglify',
		'cssmin',
		'compress',
		'assets_versioning',
		'clean',
		//'aws_s3',
		'updatelocal1',
		'updatelocal2',
		'updatelocal3',
		'updatelocal4',
		'updatelocal5'
	]);

	grunt.registerTask('prod', [
		'sass',
		'develop',
		'removelogging',
		'jshint:files',
		'concat',
		'uglify',
		'cssmin',
		'compress',
		'assets_versioning',
		'clean',
		//'aws_s3',
		'updatesrc'
	]);

	grunt.registerTask('stage', [
		'sass',
		'develop',
		'jshint:files',
		'concat',
		'uglify',
		'cssmin',
		'compress',
		'assets_versioning',
		'clean',
		//'aws_s3',
		'updatesrc'
	]);
};