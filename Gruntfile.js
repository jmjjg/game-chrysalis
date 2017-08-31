/*global module, require*/
module.exports = function( grunt ) {
	/**
	 * @todo
	 * grunt-contrib-clear
	 * grunt-contrib-jshint
	 * grunt-mkdir
	 * grunt-processhtml
	 */
	var sources = {
		all: function() {
			return this.external().concat(this.internal()).concat(this.specs());
		},
		build: function() {
			return this.dependencies().concat(this.internal());
		},
		dependencies: function() {
			return [
				'src/jquery-3.2.1.min.js',
				'src/jquery-ui-1.12.1/jquery-ui.min.js',
				'src/bootstrap.min.js',
				'src/object.polyfill.js'
			];
		},
		external: function() {
			return ['Gruntfile.js'].concat(this.dependencies());
		},
		internal: function() {
			return [
				'src/game-functions.js',
				'src/game-storage.js',
				'src/game-sounds.js',
				'src/game-settings-panel.js',
				'src/game-chrysalis-model.js',
				'src/game-chrysalis-view.js',
				'src/game-chrysalis-controller.js'
			];
		},
		specs: function() {
			return 'specs/*-spec.js';
		}
	},
	config = {
		pkg: grunt.file.readJSON( 'package.json' ),
		clean: {
			all: [
				'build',
				'out'
			]
		},
		complexity: {
			options: {
				breakOnErrors: false,
				errorsOnly: false,
				hideComplexFunctions: false,
				broadcast: false,
				cyclomatic: 4,
				halstead: 20,
				maintainability: 100
			},
			all: {
				src: sources.internal(),
				options: {
					jsLintXML: 'out/complexity/jslint.xml',
					checkstyleXML: 'out/complexity/checkstyle.xml'
				}
			}
		},
		cssmin: {
			target: {
				files: {
					'build/<%= pkg.name %>.min.css': [
						'css/bootstrap.min.css',
						'css/bootstrap-theme.min.css',
						'css/game-chrysalis.css'
					]
				}
			}
		},
		jasmine: {
			all: {
				src: sources.build(),
				options: {
					specs: sources.specs(),
					junit: {
						path: 'out/junit/'
					}
				}
			},
			coverage: {
				src: sources.build(),
				options: {
					specs: sources.specs(),
					junit: {
						path: 'out/junit/'
					},
					vendor: [
					  'node_modules/angular/angular.js',
					  'node_modules/angular-mocks/angular-mocks.js'
					],
					template: require('grunt-template-jasmine-istanbul'),
					templateOptions: {
						coverage: 'out/coverage/coverage.json',
						report: [
							{type: 'html', options: { dir: 'out/coverage' }},
							{type: 'cobertura', options: { dir: 'out/coverage/cobertura' }},
							{type: 'text-summary'}
						]
					}
				}
			}
		},
		jsdoc: {
			all: {
				src: sources.internal(),
				options: {
					destination: 'out/jsdoc/'
				}
			}
		},
		jslint: {
			all: {
				src: sources.internal(),
				directives: {
					white: true,
					browser: true,
					plusplus: true,
					nomen: true,
					regexp: true
				},
				options: {
					edition: 'latest',
					errorsOnly: true,
					failOnError: false,
					jslintXml: 'out/jslint/jslint.xml',
					checkstyle: 'out/jslint/jslint-checkstyle.xml'
				}
			}
		},
		jsvalidate: {
			options: {
				verbose: true
			},
			all: {
				files: {
					src: sources.all()
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: sources.build(),
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		watch: {
			scripts: {
				files: ['index.html'].concat(sources.all()),
				tasks: ['minimal'],
				options: {
					spawn: false,
					reload: true
				}
			}
		}
	};

	grunt.initConfig(config);
	require('load-grunt-tasks')(grunt, {
	  pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
	});

	grunt.registerTask('default', ['clean','jsvalidate','jasmine:all','jslint','complexity','jsdoc']);
	grunt.registerTask('coverage', ['clean','jsvalidate','jasmine:coverage','jslint','complexity','jsdoc']);
	grunt.registerTask('minimal', ['clean','jsvalidate','jasmine:all']);
	grunt.registerTask('release', ['minimal','cssmin','uglify']);
};