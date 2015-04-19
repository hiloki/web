module.exports = function (grunt) {
  'use strict';
  // Project configuration
  grunt.initConfig({
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