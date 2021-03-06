module.exports = function (grunt) {

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Configure Grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            all: {
                files: {
                    'htdocs/app/app.min.js': ['client/app/**/*.js']
                }
            }
        },
        clean: {
            dist: {
               src: ["htdocs/", "!node_modules/grunt/", "node_modules/**" ] 
            }
        },
        copy: {
            files: {
                cwd: 'client/',
                src: ['*.php', '*.html', '.htaccess'],
                dest: 'htdocs/',
                expand: true 
            }
        },
        connect: {
            all: {
                options: {
                    port: 9000,
                    hostname: "127.0.0.4",
                    base: 'htdocs',
                    middleware: function (connect, options) {
                        return [
                            require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
                            connect.static(options.base)
                        ];
                    }
                }
            }
        },
        // grunt-open will open your browser at the project's URL
        open: {
            client: {
                // Gets the port from the connect configuration
                //path: 'http://localhost:<%= connect.all.options.port%>'
                path: 'http://127.0.0.4:9000/'
            },
            server: {
                path: 'http://127.0.0.4:80/'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: [
                    'client/app/**/*.js',
                    'client/index.html',
                    'client/index.php',
                    'client/.htaccess',
                    'client/app/**/*.html'
                ],
                tasks: ['uglify', 'copy'],
                options: {
                    spawn: false
                }
            },
            sass: {
                files: 'client/sass/**/*.scss',
                tasks: ['sass']
            }
        },
        sass: {
            options: {
                outputStyle: 'compressed',
                sourceMap: true,
                sourceComments: false
            },
            dist: {
                files: {
                    'htdocs/css/app.css': 'client/sass/app.scss'
                }
            }
        }


    });


    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('delete', [
        'clean:dist'
    ]);
    
    grunt.registerTask('dev', [
        'sass',
        'copy',
        'uglify:all',
        'connect',
        'open:client',
        'watch'
    ]);

    grunt.registerTask('dist', [
        'sass',
        'copy',
        'uglify:all'
    ]);

    grunt.registerTask('serverstart', [
        'open:server'
    ]);
};
