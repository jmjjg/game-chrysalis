module.exports = function( grunt ) {
	/**
	 * @todo
	 * grunt-contrib-clean
	 * grunt-contrib-jshint
	 * grunt-mkdir
	 * grunt-processhtml
	 */
	var sources = {
		all: function() {
			return this.external().concat(this.internal());
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
				'src/game-storage.js',
				'src/game-sounds.js',
				'src/game-settings-panel.js',
				'src/game-chrysalis.js'
			];
		}
	},
	config = {
		pkg: grunt.file.readJSON( 'package.json' ),
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
				tasks: ['release'],
				options: {
					spawn: false,
					reload: true
				}
			}
		}
	};

	grunt.initConfig(config);
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('default', ['jsvalidate','jslint','complexity','jsdoc']);
	grunt.registerTask('release', ['default','cssmin','uglify']);
};