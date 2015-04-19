module.exports = function (grunt) {
  'use strict';
  // Project configuration
  grunt.initConfig({
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
    webfont: {
      dist: {
        src: 'public/svg/*.svg',
        dest: 'public/font/',
        destCss: 'stylus/',
        options: {
          types: ['woff', 'ttf'],
          stylesheet: 'styl',
          htmlDemo: false,
          syntax: 'bootstrap',
          relativeFontPath: '/font/'
        }
      }
    }
  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task
  grunt.registerTask('default', ['develop']);
  grunt.registerTask('develop', ['connect', 'watch']);
  grunt.registerTask('css', ['stylus', 'autoprefixer', 'csscomb', 'csso']);
  grunt.registerTask('js', ['concat', 'browserify', 'uglify', 'clean']);
};