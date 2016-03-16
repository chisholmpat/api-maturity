module.exports = function(grunt) {

  grunt.initConfig({
    //configurations for running sass compile
    sass: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: [{
          expand: true, //recursive
          cwd: "public/sass/", //starting folder
          src: ["**/*.scss"], //matching files
          dest: "public/css/", //destenation folder
          ext: ".css"
        }]
      }
    },
    //configurations for running postCSS compile
    postcss: {
      options: {
        //plugins used by postCSS
        processors: [
          require('autoprefixer')()
        ]
      },
      dist: {
        files: [{
          //same format as above, but source and destination folders are the same. files are overwriten by process.
          expand: true, //recursive
          cwd: "public/css/",
          src: ["**/*.css"],
          dest: "public/css/",
          ext: ".css"
        }]

      }
    },
    watch: {
      css: {
        files: ['public/sass/*.scss'],
        tasks: ['sass', 'postcss']
      }
    }
  });



  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('css', ['sass', 'postcss']);

};
