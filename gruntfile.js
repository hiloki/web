module.exports = function(grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Task configuration
        autoprefixer: {
            options: ['last 2 version'],
            dist: {
                src: 'public/stylesheets/app.css'
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
                    'public/stylesheets/app.css': ['public/stylesheets/app.css']
                }
            }
        },
        csso: {
            dist: {
                files: {
                    'public/stylesheets/app.css': ['public/stylesheets/app.css']
                }
            }
        },
        stylus: {
            dist: {
                files: {
                    'public/stylesheets/app.css': 'stylus/app.styl'
                }
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

    // Default task
    grunt.registerTask('default', ['develop']);
    grunt.registerTask('develop', ['connect', 'watch']);
    grunt.registerTask('stylesheet', ['stylus', 'autoprefixer', 'csscomb', 'csso']);
};