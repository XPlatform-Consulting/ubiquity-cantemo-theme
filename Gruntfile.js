'use strict';

module.exports = function(grunt){

  grunt.initConfig({

    compass: {                  // Task
      dist: {                   // Target
        options: {
          config: 'config.rb'
        },
      },

      // having troubles comipling their scss (error occurs) load css and compress instead
      // mdl: {
      //   options:{
      //     sassDir: 'node_modules/material-design-lite/src',
      //     cssDir: './build/css'
      //   }
      // }
    },

    watch: {
      css: {
        files: 'portal_media/mdl/assets/sass/**/*.scss',
        tasks: ['default']
      },
 
      scripts: {
        files: ['portal_media/mdl/assets/js/**/*.js', '!portal_media/mdl/assets/js/**/*.min.js'],
        tasks: ['default']
      }
    },

    jshint: {
      all: ['portal_media/mdl/assets/js/libs/**/*.js', '!portal_media/mdl/assets/js/libs/**/*.min.js', '!portal_media/mdl/assets/js/libs/jquery-growl/**/*.js']
    },

    uglify:{
      my_target: {
        files: {
          'mdl_plugin.min.js': ['portal_media/mdl/assets/js/libs/**/*.js','node_modules/material-design-lite/material.js']
        }
      }
    },

    cssmin: {
      options: {
        sourceMap: true,
      },
      app: {
        src: ['portal_media/mdl/build/css/**/*.css', '!portal_media/mdl/build/css/**/*.min.css', 'node_modules/material-design-lite/material.css'],
        dest: 'mdl_plugin.min.css'
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  // js framework not compatible with jshint? to many hints occure.
  grunt.registerTask('default', ['jshint', 'compass', 'cssmin', 'uglify']);
  grunt.registerTask('watch', [ 'compass', 'cssmin',  'uglify']);

};