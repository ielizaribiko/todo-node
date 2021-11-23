const { loadNpmTasks } = require("grunt");

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-dustjs');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
     // Configuracion del plugin grunt-contrib-cssmin
    cssmin: {
      target: {
          files: [{
              expand: true,
              cwd: 'public/stylesheets',
              src: ['**/*.css', '!**/*.min.css'],
              dest: 'public/stylesheets/',
              ext: '.min.css'
          }]
      }
    },

    // Configuracion del plugin grunt-contrib-less
    less: {
        desarrollo: {
            options: {
                paths: ['less']
            },
            files: [{
              expand: true,
              cwd: 'less',
              src: ['**/*.less'], 
              ext: '.css',
              dest: 'public/stylesheets'
            }]
        },
    },

    dustjs: {
      compile:{
        files:{
          'public/javascripts/compiled/templates.js':'views/**/*.dust'
        }
      }
      
    },    
    
  });

  // Tarea por defecto
  grunt.registerTask('default', ['dustjs:compile']);

  grunt.registerTask('pro', ['less:produccion', 'autoprefixer:dist', 'cssmin', 'copy:main']);
};