module.exports = function(grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Task configuration
        autoprefixer: {
            options: ['last 2 version'],
            dist: {
                src: 'public/css/app.css'
            }
        },
        connect: {
            dist: {
                options: {
                    port: 5001,
                    base: 'public/'
                }
            }
        },
        csscomb: {
            dist: {
                files: {
                    'public/css/app.css': ['public/css/app.css']
                }
            }
        },
        csso: {
            dist: {
                files: {
                    'public/css/app.min.css': ['public/css/app.css']
                }
            }
        },
        stylus: {
            dist: {
                files: {
                    'public/css/app.css': 'stylus/app.styl'
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    'public/js/bundle.js': 'public/js/app.js'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'public/js/app.min.js': 'public/js/bundle.js'
                }
            }
        },
        clean: {
            js: {
                src: ['public/js/bundle.js']
            }
        },
        watch: {
            options: {
                livereload: true
            },
            dist: {
                files: ['stylus/*.styl'],
                tasks: ['stylesheet']
            }
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task
    grunt.registerTask('default', ['develop']);
    grunt.registerTask('develop', ['connect', 'watch']);
    grunt.registerTask('stylesheet', ['stylus', 'autoprefixer', 'csscomb', 'csso']);
    grunt.registerTask('js', ['browserify', 'uglify', 'clean']);
};