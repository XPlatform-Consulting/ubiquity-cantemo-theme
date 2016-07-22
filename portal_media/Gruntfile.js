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
        files: 'assets/sass/**/*.scss',
        tasks: ['default']
      },

      scripts: {
        files: ['assets/js/**/*.js', '!assets/js/**/*.min.js'],
        tasks: ['default']
      }
    },

    jshint: {
      all: ['assets/js/**/*.js', '!assets/js/**/*.min.js']
    },

    uglify:{
      my_target: {
        files: {
          'mdl_plugin.min.js': ['assets/js/**/*.js','node_modules/material-design-lite/utils/material.js']
        }
      }
    },

    cssmin: {
      options: {
        sourceMap: true,
      },
      app: {
        src: ['build/css/**/*.css', '!build/css/**/*.min.css', 'node_modules/material-design-lite/material.css'],
        dest: 'mdl_plugin.min.css'
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  // js framework not compatible with jshint? to many hints occure.
  grunt.registerTask('default', ['compass', 'cssmin', 'uglify']);
  grunt.registerTask('watch', ['compass', 'cssmin', 'uglify']);

};